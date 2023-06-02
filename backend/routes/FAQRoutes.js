const express = require("express");
const router = express.Router();
const {
  createFAQ,
  updateFAQ,
  deleteFAQ,
  getAllFAQS,
  getFAQ,
} = require("../controllers/FAQController");
const {isAuthenticatedUser, authorizeRoles} = require("../middleware/auth");
router.route("/faqs").post(isAuthenticatedUser,authorizeRoles('admin'), createFAQ);
router.route("/faqs/:id").put(isAuthenticatedUser,authorizeRoles('admin'), updateFAQ);
router.route("/faqs/:id").delete(isAuthenticatedUser,authorizeRoles('admin'), deleteFAQ);
router.route("/faqs").get(getAllFAQS);
router.route("/faqs/:id").get(getFAQ);
module.exports = router;
