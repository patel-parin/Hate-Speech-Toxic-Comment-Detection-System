const express = require("express");
const { predictText, getHistory ,getStats ,getExampleComment} = require("../controller/predictController");

const router = express.Router();

router.post("/", predictText);
router.get("/history", getHistory);
router.get("/stats", getStats);
router.get("/example", getExampleComment);

module.exports = router;
