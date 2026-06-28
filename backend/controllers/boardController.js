const Board = require("../models/Board");

async function getBoards(req, res) {
  try {
    const boards = await Board.find();
    res.status(200).json(boards);
  } catch (error) {
    res.status(500).json({ message: "Could not get boards" });
  }
}

async function createBoard(req, res) {
  try {
    const title = req.body.title;
    const description = req.body.description;

    if (!title) {
      return res.status(400).json({ message: "Board title is required" });
    }

    const newBoard = new Board({
      title: title,
      description: description
    });

    const savedBoard = await newBoard.save();
    res.status(201).json(savedBoard);
  } catch (error) {
    res.status(500).json({ message: "Could not create board" });
  }
}

async function deleteBoard(req, res) {
  try {
    const deletedBoard = await Board.findByIdAndDelete(req.params.id);

    if (!deletedBoard) {
      return res.status(404).json({ message: "Board not found" });
    }

    res.status(200).json({ message: "Board deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete board" });
  }
}

module.exports = {
  getBoards,
  createBoard,
  deleteBoard
};
