const { PubSub, withFilter } = require("apollo-server-express");
const requiresAuth = require("../middleware/permission");
const Channel = require("../models/channel");
const Directmessage = require("../models/directMessage");
const Member = require("../models/member");
const User = require("../models/user");

const NEW_DIRECT_MESSAGE = "NEW_DIRECT_MESSAGE ";

const pubsub = new PubSub();

module.exports = {
  Subscription: {
    newDirectMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(NEW_DIRECT_MESSAGE),
        (payload, args, { user }) => {
          return true;
          // return (
          //   payload.teamId === args.teamId &&
          //   ((payload.senderId === user._id &&
          //     payload.receiverId === args.userId) ||
          //     (payload.senderId === args.userId &&
          //       payload.receiverId === user._id))
          // );
        }
      ),
    },
  },
  DirectMessage: {
    sender: ({ sender, senderId }, args, req) => {
      if (sender) {
        return sender;
      }
      return User.findOne({ _id: senderId });
    },
  },
  Query: {
    directMessages: requiresAuth.createResolver(
      async (parent, { teamId, receiverId }, { req: { user } }) => {
        try {
          const msgs = await Directmessage.find({
            $and: [
              { teamId },
              {
                $or: [
                  {
                    $and: [{ receiverId }, { senderId: user._id }],
                  },
                  {
                    $and: [{ receiverId: user._id }, { senderId: receiverId }],
                  },
                ],
              },
            ],
          });
          return msgs;
        } catch (error) {
          console.error(error);
          return [];
        }
      }
    ),
  },
  Mutation: {
    createDirectMessage: requiresAuth.createResolver(
      async (parent, { receiverId, text, teamId }, { req: { user } }) => {
        try {
          const directMessage = await Directmessage.create({
            receiverId,
            text,
            teamId,
            senderId: user._id,
          });
          // console.log(directMessage);

          pubsub.publish(NEW_DIRECT_MESSAGE, {
            teamId: teamId,
            senderId: user._id,
            receiverId: receiverId,
            newDirectMessage: {
              id: directMessage._id,
              text: directMessage.text,
              receiverId: directMessage.receiverId,
              teamId: directMessage.teamId,
              createdAt: directMessage.createdAt,
              sender: {
                username: user.username,
              },
            },
          });

          return true;
        } catch (err) {
          console.log(err);
          return false;
        }
      }
    ),
  },
};
