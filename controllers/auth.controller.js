const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokens");
const User = require("./../models/user.model");
const bcrypt = require("bcrypt");

const signUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All Fields Are Required" });
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(409).json({ message: "User Already Exists" });
    }

    // Hash Password
    // const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password,
      role: "user",
    });

    //Tokens
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    newUser.refreshToken = refreshToken;
    await newUser.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, refreshToken: __, ...userData } = newUser.toObject();
    res.status(201).json({
      message: "signup successful",
      // accessToken,
      user: userData,
    });
  } catch (err) {
    console.log(`Error :- ${err}`);
    next(err);
  }
};

const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password are Required" });
    }
    const user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, refreshToken: __, ...userData } = user.toObject();

    res.status(200).json({
      message: "Login successful",
      // accessToken,
      user: userData,
    });
  } catch (err) {
    console.log(`Error :- ${err}`);
    next(err);
  }
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

const logOut = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({ message: "No refresh token found" });
    }

    const user = await User.findOne({ refreshToken });

    if (!user) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
      });
      return res.status(200).json({ message: "Logged out successfully" });
    }
    user.refreshToken = null;
    await user.save();

    // Clear cookie in browser

    // Clear cookies
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.log(`Error :- ${err}`);
    next(err);
  }
};

module.exports = { Login, signUp, refreshToken, logOut, changePassword, me };
