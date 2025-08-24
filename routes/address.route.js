const { authenticateToken } = require("../middleware/auth.middleware");
const {
  addAddress,
  getAddresses,
  removeAddress,
  updateAddress,
} = require("../controllers/address.controller");

const express = require("express");
const router = express.Router();

router.post("/", authenticateToken, addAddress); 
router.get("/", authenticateToken, getAddresses); 
router.put("/:addressId", authenticateToken, updateAddress); 
router.delete("/:addressId", authenticateToken, removeAddress); 


module.exports = router;
