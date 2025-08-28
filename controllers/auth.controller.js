const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokens");
const User = require("./../models/user.model");
const bcrypt = require("bcrypt");

const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  const existUser = await User.findOne({ email });
  if (existUser)
    return res.status(409).json({ message: "User already exists" });

  const newUser = await User.create({ name, email, password, role: "user" });

  const accessToken = generateAccessToken(newUser);
  const refreshToken = generateRefreshToken(newUser);

  newUser.refreshToken = refreshToken;
  await newUser.save();

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res
    .status(201)
    .json({
      message: "Signup successful",
      user: { id: newUser._id, name, email, role: newUser.role },
    });
};

const Login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res
    .status(200)
    .json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email, role: user.role },
    });
};

const logOut = async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out successfully" });
};

const refreshToken = async (req, res, next) => {
  const token = req.cookies.refreshToken;
  if (!token)
    return res.status(401).json({ message: "No refresh token provided" });

  let payload;
  try {
    payload = jwt.verify(token, process.env.REFRESH_TOKEN);
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }

  const user = await User.findById(payload.id);
  if (!user || user.refreshToken !== token) {
    return res.status(403).json({ message: "Refresh token does not match" });
  }

  // طلع accessToken جديد وخزّنه في الكوكي
  const newAccessToken = generateAccessToken(user);
  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  res.json({ message: "Access token refreshed successfully" });
};

const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both old and new passwords are required" });
    }

    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    user.password = newPassword;
    user.passwordChangeAt = Date.now();

    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    next(err);
  }
};

const me = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ message: "No access token provided" });
    }
    let payload;
    try {
      payload = jwt.verify(token, process.env.ACCESS_TOKEN);
    } catch (err) {
      console.log(err);
      return res
        .status(401)
        .json({ message: "Invalid or expired access token" });
    }
    res.json(user);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = { Login, signUp, refreshToken, logOut, changePassword, me };
