const jwt = require("jsonwebtoken");
const User = require("../models/user");

const SECRET = "fdfsdfsd";
const SECRET2 = "sdfsdfsdffsdfasgsdf";

const createTokens = async (user, refreshSecret) => {
  const createToken = jwt.sign({ user }, SECRET, {
    expiresIn: "1h",
  });

  const createRefreshtoken = jwt.sign({ user }, refreshSecret, {
    expiresIn: "7d",
  });

  return [createToken, createRefreshtoken];
};

const refreshtokens = async (token, refreshtoken) => {
  let userId;

  try {
    const { user } = jwt.decode(refreshtoken);
    userId = user._id;
  } catch (error) {
    return {};
  }

  if (!userId) {
    return {};
  }

  const user = await User.findById(userId);
  // console.log("refresh-user", user);

  if (!user) {
    return {};
  }

  const refreshSecret = user.password + SECRET2;

  try {
    jwt.verify(refreshtoken, refreshSecret);
  } catch (error) {
    return {};
  }

  const [newToken, newRefreshtoken] = await createTokens(user, refreshSecret);

  return {
    token: newToken,
    refreshtoken: newRefreshtoken,
    user,
  };
};

const auth = async (req, res, next) => {
  const token = req.headers["x-token"];
  if (token) {
    try {
      const { user } = jwt.verify(token, SECRET);
      req.user = user;
    } catch (error) {
      console.log(error);
      const refreshtoken = req.headers["x-refresh-token"];
      const newTokens = await refreshtokens(token, refreshtoken);
      if (newTokens.token && newTokens.refreshToken) {
        res.set("Access-Control-Expose-Headers", "x-token, x-refresh-token");
        res.set("x-token", newTokens.token);
        res.set("x-refresh-token", newTokens.refreshToken);
      }
      req.user = newTokens.user;
    }
  }
  next();
};

module.exports = {
  auth,
  refreshtokens,
  createTokens,
  SECRET,
  SECRET,
};
