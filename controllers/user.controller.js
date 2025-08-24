const User = require("./../models/user.model");
const bcrypt = require("bcrypt");

const addUser = async (req, res, next) => {
  try {
    const { name, email, password, role = "user" } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All Fields are Required" });
    }
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
      role,
    });
    const { password: _, refreshToken: __, ...userData } = newUser.toObject();
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: userData,
    });
  } catch (err) {
    console.log(`Error :- ${err}`);
    next(err);
  }
};

const getAllUser = async (req, res, next) => {
  try {
    const users = await User.find().select("-password -refreshToken");
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    console.log(`Error :- ${err}`);
    next(err);
  }
};

const getSingleUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -refreshToken"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.log(`Error :- ${err}`);
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    }).select("-password -refreshToken");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (err) {
    console.log(`Error :- ${err}`);
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.log(`Error :- ${err}`);
    next(err);
  }
};

module.exports = { addUser, updateUser, deleteUser, getAllUser, getSingleUser };
