const User = require("./../models/user.model");

// that make update for user model
const addToWishList = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    // update user wishlist
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { wishlist: productId } }, //Prevent التكرار
      { new: true }
    ).populate("wishlist", "title price imgCover");

    res.status(200).json({
      message: "Product added to wishlist",
      wishlist: user.wishlist,
    });
  } catch (err) {
    console.log(`Error :- ${err}`);
    next(err);
  }
};

const removeFromWishList = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params; // ✅ جاي من params

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: productId } },
      { new: true }
    ).populate("wishlist", "title price imgCover");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Product removed from wishlist",
      wishlist: user.wishlist,
    });
  } catch (err) {
    console.log(`Error :- ${err}`);
    next(err);
  }
};


const getWishList = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "wishlist",
      "title price imgCover"
    );
    res.status(200).json({ wishlist: user.wishlist });
  } catch (err) {
    console.log(`Error :- ${err}`);
    next(err);
  }
};

module.exports = { addToWishList, removeFromWishList, getWishList };
