const { UserInputError } = require("apollo-server-express");
const { ObjectId } = require("mongoose").Types;
const User = require("../models/user");
const requireAuth = require("../middleware/permission");
const Member = require("../models/member");
const Team = require("../models/team");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { signupSchema } = require("../validation/userValidation");
const Joi = require("joi");
const { createTokens } = require("../middleware/authMiddleware");

const NEW_USER = "NEW_USER";

const maxAge = 3 * 24 * 60 * 60;

module.exports = {
  User: {
    teams: async (root, args, { req }, info) => {
      try {
        let teams = [];
        // const userTeams = await Team.find({ owner: req.user._id });
        const members = await Member.find({ userId: req.user._id });

        const teamIds = members.map((mm) => mm.teamId);

        const memberTeams = await Team.find({ _id: [...teamIds] });

        teams = [...memberTeams];
        console.log(req.user, teams, members);
        return teams;
      } catch (error) {
        console.error(error);
      }
    },
  },
  Query: {
    allUsers: (root, args, { req, res, pubSub }, info) => {
      return User.find({});
    },
    me: requireAuth.createResolver(
      async (root, { id }, { req, pubsub }, info) => {
        return await User.findOne({ _id: req.user._id });
      }
    ),
    getUser: (_, { userId }, { req }) => User.findById(userId),
  },
  Mutation: {
    createUser: async (root, args, { res }, info) => {
      await signupSchema.validateAsync(args, { abortEarly: false });
      const user = await User.create(args);
      return user;
    },
    loginUser: async (root, { email, password }, { req, res }, info) => {
      let errors = [];
      const user = await User.findOne({ email });
      if (!user) {
        errors.push({ error: "wrong email" });
        console.log(errors);
        return {
          errors,
        };
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        errors.push({ error: "wrong password" });
        console.log(errors);
        return {
          errors,
        };
      }
      const refreshSecret = user.password + process.env.SECRET2;

      const [newToken, newRefreshtoken] = await createTokens(
        user,
        refreshSecret
      );

      return {
        token: newToken,
        refreshToken: newRefreshtoken,
      };
    },
  },
  Subscription: {
    newUser: {
      subscribe(root, args, { pubSub }, info) {
        return pubSub.asyncIterator(NEW_USER);
      },
    },
  },
};
