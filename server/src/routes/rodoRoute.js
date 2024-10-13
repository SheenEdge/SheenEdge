const express = require("express");
const router = express.Router();
const {getRoad} = require('../contoller/roadController')

router.route("/generate-roadmap").post(getRoad)


module.exports = router;