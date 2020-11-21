const requireAuth = require("../middleware/permission");
const Channel = require("../models/channel");
const Member = require("../models/member");
const PCMember = require("../models/pcmember");
const Team = require("../models/team");
const User = require("../models/user");

module.exports = {
  Query: {
    channels: () => Channel.find({}),
    channel: (_, __, { id }) => Channel.findById(id),
  },

  Mutation: {
    getOrCreateChannel: requireAuth.createResolver(
      async (parent, { teamId, members }, { req: { user } }) => {
        const member = await Member.findOne({ teamId, userId: user._id });

        if (!member) {
          throw new Error("Not Authorized");
        }

        const allMembers = [...members, user._id];
        // check if dm channel already exists with these members

        const users = await User.find({
          _id: members,
        });

        const name = users.map((u) => u.username).join(", ");

        const channels = await Channel.find({
          $and: [{ teamId }, { dm: true }, { public: false }, { name }],
        });
        console.log(channels);
        if (channels.length) {
          return {
            id: channels._id,
            name: channels.name,
          };
        }

        const channel = await Channel.create({
          name,
          public: false,
          dm: true,
          teamId,
        });
        const cId = channel._id;
        const pcmembers = allMembers.map((m) => ({
          userId: m,
          channelId: cId,
        }));
        await PCMember.create(pcmembers);

        return {
          id: cId,
          name,
        };
      }
    ),
    createChannel: requireAuth.createResolver(
      async (root, args, { req: { user } }, info) => {
        try {
          const team = await Team.findOne({ _id: args.teamId });
          if (!team.admin) {
            return {
              ok: false,
              error: { error: "You are not owner of the team" },
            };
          }
          const channel = await Channel.create(args);
          // console.log(channel);
          if (!args.public) {
            const members = args.members.filter((m) => m !== user._id);
            members.push(user._id);
            const pcmembers = members.map((m) => ({
              userId: m,
              channelId: channel._id,
            }));
            await PCMember.create(pcmembers);
          }

          return {
            ok: true,
            channel,
          };
        } catch (error) {
          console.error(error);
          return {
            ok: false,
            error: error.message,
          };
        }
      }
    ),
  },
};
