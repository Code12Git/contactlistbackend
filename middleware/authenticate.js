const jwt = require("jsonwebtoken");
const User = require("../model/user");

const authenticate = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const decodedData = jwt.verify(token, process.env.SECRET_KEY);
    console.log({ token, decodedData });
    const user = await User.findOne({
      _id: decodedData._id,
      "tokens.token": token,
    }).lean();
    if (!user) {
      throw new Error("User not found");
    }
    console.log({ user });
    req.user = user;
    return next();
  } catch (err) {
    console.log({ err });
    res.status(401).send("No token provided");
  }
};
module.exports = authenticate;
