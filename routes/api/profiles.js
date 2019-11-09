const express = require("express");
const router = express.Router();
const secured = require("../../middleware/secured");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");
const Profile = require("../../models/Profile");

// @route   GET api/profiles/:user_id
// @desc    Get current user's profile
// @access  Private
router.get("/:userId", secured(), async (req, res) => {
  try {
    // Grab user's profile by their user_id -> profile.id
    // Also grab the nickname and avatar of the user from Users table
    const profile = await Profile.query()
      .where("user_id", req.params.userId)
      .eager("users");

    if (!(profile && profile.length)) {
      return res.status(400).send("No profile exists for this user");
    }

    res.send(profile);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/profiles/:user_id
// @desc    Create new profile for current user
// @access  Private
router.post(
  "/:userId",
  [
    secured(),
    [
      check("role", "Role field is required")
        .not()
        .isEmpty(),
      check("skills", "Skills field is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  }
);

module.exports = router;
