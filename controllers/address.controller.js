const User = require("./../models/user.model");

const addAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { city, street, phone } = req.body;
    if (!city || !street || !phone) {
      return res
        .status(400)
        .json({ message: "city, street and phone are required" });
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { addresses: { city, street, phone } } },
      { new: true }
    );
    res.status(200).json({
      message: "Address added successfully",
      addresses: user.addresses,
    });
  } catch (err) {
    console.log(`Error:- ${err}`);
    next(err);
  }
};

const getAddresses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ addresses: user.addresses });
  } catch (err) {
    console.log(`Error:- ${err}`);
    next(err);
  }
};

const removeAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { addresses: { _id: addressId } } },
      { new: true }
    );

    res.status(200).json({
      message: "Address removed successfully",
      addresses: user.addresses,
    });
  } catch (err) {
    console.log(`Error:- ${err}`);
    next(err);
  }
};

const updateAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    const { city, street, phone } = req.body;

    const user = await User.findOneAndUpdate(
      { _id: userId, "addresses._id": addressId },
      {
        $set: {
          "addresses.$.city": city,
          "addresses.$.street": street,
          "addresses.$.phone": phone,
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Address not found" });
    }

    res
      .status(200)
      .json({
        message: "Address updated successfully",
        addresses: user.addresses,
      });
  } catch (err) {
    console.log(`Error:- ${err}`);
    next(err);
  }
};
module.exports = { addAddress, getAddresses, removeAddress, updateAddress };

// 01007742805