const express = require("express");
const router = express.Router();

const {
  getBoards,
  createBoard,
  deleteBoard
} = require("../controllers/boardController");

router.get("/", getBoards);
router.post("/", createBoard);
router.delete("/:id", deleteBoard);

module.exports = router;
