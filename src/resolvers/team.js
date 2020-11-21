const requireAuth = require("../middleware/permission");
const Channel = require("../models/channel");
const Directmessage = require("../models/directMessage");
const Member = require("../models/member");
const PCMember = require("../models/pcmember");
const Team = require("../models/team");
const User = require("../models/user");

const NEW_TEAM = "NEW TEAM";

module.exports = {
  Query: {
    getTeamMembers: requireAuth.createResolver(
      async (parent, { teamId }, { req: { user } }) => {
        try {
          const members = await Member.find({ teamId });
          const userIds = members.map((mm) => mm.userId);
          const uteams = userIds.filter(
            (ut) => ut.toString() !== user._id.toString()
          );

          const usersInTeam = await User.find({ _id: uteams });

          return usersInTeam;
        } catch (error) {
          console.error(error);
        }
      }
    ),
  },
  Mutation: {
    addTeamMember: requireAuth.createResolver(
      async (root, { email, teamId }, { req, pubSub }, info) => {
        try {
          const userToAddPromise = User.findOne({ email });
          const memberToPromise = Member.findOne({
            teamId,
            userId: req.user._id,
          });
          const teamPromise = Team.findOne({
            _id: teamId,
            owner: req.user._id,
          });
          const [team, userToAdd] = await Promise.all([
            teamPromise,
            // memberToPromise,
            userToAddPromise,
          ]);
          if (!team.admin) {
            return {
              ok: false,
              error: { error: "You cannot add members to the team" },
            };
          }
          if (!userToAdd) {
            return {
              ok: false,
              error: { error: "Could not find user with this email" },
            };
          }

          await Member.create({ userId: userToAdd._id, teamId });
          return {
            ok: true,
          };
        } catch (error) {
          console.error(error);
          return {
            ok: false,
            error: { error: error.message },
          };
        }
      }
    ),
    createTeam: requireAuth.createResolver(
      async (root, args, { req, pubSub }, info) => {
        try {
          const team = await Team.create({
            name: args.name,
            owner: req.user._id,
            admin: true,
          });
          await Member.create({
            userId: req.user._id,
            teamId: team._id,
          });
          await Channel.create({
            name: `general`,
            teamId: team._id,
            public: true,
          });
          return {
            ok: true,
            team,
          };
        } catch (error) {
          console.error(error);
          if (error.code === 11000) {
            return {
              ok: false,
              error: { error: "Team already exists" },
            };
          }
        }
      }
    ),
  },
  Team: {
    channels: async ({ id }, args, { req: { user } }, info) => {
      const pcMembers = await PCMember.find({ userId: user._id });
      const pChannelIds = pcMembers.map((pcm) => pcm.channelId);
      const channels = await Channel.find({
        $and: [
          { teamId: id },
          { $or: [{ public: true }, { _id: pChannelIds }] },
        ],
      });
      // console.log(channels);
      return channels;
    },
    directMessageMembers: async ({ id }, args, { req: { user } }) => {
      const directmessages = await Directmessage.find({
        $and: [
          { teamId: id },
          { $or: [{ receiverId: user._id }, { senderId: user._id }] },
        ],
      });
      const receiverIds = directmessages.map((dm) => dm.receiverId);
      const senderIds = directmessages.map((dm) => dm.senderId);

      const users = await User.find({
        $or: [{ _id: [...receiverIds] }, { _id: [...senderIds] }],
      });
      const musers = users.filter(
        (u) => u._id.toString() !== user._id.toString()
      );

      return musers;
    },
  },
  Subscription: {
    newTeam: {
      subscribe: (root, args, { pubSub }, info) => {
        return pubSub.asyncIterator(NEW_TEAM);
      },
    },
  },
};
