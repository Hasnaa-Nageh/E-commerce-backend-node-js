const Review = require("./../models/review.model");

const addReview = async (req, res, next) => {
  try {
    const { product, comment, rate } = req.body;
    //  check for review using same user on same product to don`t allow to write for more than one comment
    const existReview = await Review.findOne({ user: req.user.id, product });
    if (existReview) {
      return res
        .status(400)
        .json({ message: "You already reviewed this product" });
    }
    const review = await Review.create({
      product,
      user: req.user.id,
      comment,
      rate,
    });
    res.status(201).json({ message: "Review added successfully", review });
  } catch (err) {
    console.log(`Error :- ${err}`);
    next(err);
  }
};

const getAllReview = async (req, res, next) => {
  try {
    const { productId } = req.body;
    let filter = {};
    if (productId) filter.product = productId;
    const reviews = await Review.find(filter)
      .populate("user", "name email")
      .populate("product", "name price");
    res.status(200).json({ count: reviews.length, reviews });
  } catch (err) {
    console.log(`Error :- ${err}`);
    next(err);
  }
};

const getSingleReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("user", "name email")
      .populate("product", "name price");
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json({ review });
  } catch (err) {
    console.log(`Error :- ${err}`);
    next(err);
  }
};

const updateReview = async (req, res, next) => {
  try {
    const { rate, comment } = req.body;
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Allow only owner of review to update
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    review.rate = rate || review.rate;
    review.comment = comment || review.comment;

    await review.save();

    res.status(200).json({ message: "Review updated successfully", review });
  } catch (err) {
    console.log(`Error :- ${err}`);
    next(err);
  }
};
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Allow only owner or admin
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await review.deleteOne();
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    console.log(`Error :- ${err}`);
    next(err);
  }
};

module.exports = {
  addReview,
  updateReview,
  deleteReview,
  getAllReview,
  getSingleReview,
};
