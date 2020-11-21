const { PubSub, withFilter } = require("apollo-server-express");
const { createWriteStream } = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { requireTeamAccess } = require("../middleware/permission");
const requireAuth = require("../middleware/permission");
const Message = require("../models/message");
const User = require("../models/user");
const Channel = require("../models/channel");
const PCMember = require("../models/pcmember");

const pubSub = new PubSub();

const NEW_MESSAGE = "NEW POST";

module.exports = {
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        () => pubSub.asyncIterator(NEW_MESSAGE),
        (payload, args, ctx) => {
          return payload.channelId === args.channelId;
        }
      ),
    },
  },
  Message: {
    user: async ({ user, userId }, _, { req }) => {
      try {
        if (user) {
          return user;
        } else {
          return await User.findOne({ _id: userId });
        }
      } catch (error) {
        console.error(error);
      }
    },
  },

  Query: {
    messages: requireAuth.createResolver(
      async (_, { offset, channelId }, { req: { user } }, ___) => {
        const channel = await Channel.findOne({ _id: channelId });

        if (!channel.public) {
          const member = await PCMember.findOne({
            channelId,
            userId: user._id,
          });
          if (!member) {
            throw new Error("Not Authorized");
          }
        }
        return Message.find({ channelId })
          .limit(10)
          .skip(offset)
          .sort({ createdAt: -1 });
      }
    ),
    message: (root, { id }, context, info) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("can't find post");
      }
      return Message.findById(id);
    },
  },

  Mutation: {
    createMessage: requireAuth.createResolver(
      async (root, args, { req }, info) => {
        // console.log(args);
        try {
          const message = await Message.create({
            // ...messageData,
            text: args.text,
            channelId: args.channelId,
            userId: req.user._id,
          });
          // console.log(message);

          const user = await User.findOne({ _id: req.user._id });

          pubSub.publish(NEW_MESSAGE, {
            channelId: args.channelId,
            newMessage: {
              id: message._id,
              text: message.text,
              createdAt: message.createdAt,
              user,
            },
          });
          return true;
        } catch (error) {
          console.error(error);
          return false;
        }
      }
    ),
    singleUpload: (parent, args) => {
      return args.file.then(async (file) => {
        const { createReadStream, filename } = await file;
        console.log(filename);
        let files = [];
        await new Promise((res) =>
          createReadStream()
            .pipe(
              createWriteStream(path.join(__dirname, "../images", filename))
            )
            .on("close", res)
        );

        files.push(filename);
        console.log(files);
        return {
          url: `http://localhost:3000/${filename}`,
        };
      });
    },
  },
};
