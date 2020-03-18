const express = require("express");
const router = express.Router();
const {
  userAuthentication,
  registrationNewUser
} = require("../controllers/authentication");

router.route("/auth").post(userAuthentication);
router.route("/register").post(registrationNewUser);

// router
//   .route('/:login')
//   .delete(deleteTransaction);

module.exports = router;
