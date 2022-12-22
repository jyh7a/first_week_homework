const express = require("express");
const router = express.Router();

const Board = require("../models/board");
const Comment = require("../models/comment");

// 전체 게시글 조회
router.get("/boards", async (req, res) => {
  try {
    // const boards = await Board.find({}).sort({ createdAt: -1 });
    // 오류 예제
    // try catch 있을때/없을때
    const boards = await NonexistentCollection.find({});

    res.send(boards);
  } catch (error) {
    console.error(error);

    res.status(500).send({ message: error.message });
  }
});

// 특정 게시글 조회
router.get("/boards/:boardId", async (req, res) => {
  try {
    const { boardId } = req.params;
    // 오류테스트
    // const boardId = "63a11f34dee1fb38182cdb93234234";
    const board = await Board.findById(boardId);

    // mongoose.set("strictQuery", false); 설명예제
    // const board = await Board.find({ notInSchema: 1 });
    // // strictQuery true
    // const board = await Board.find({});
    // // strictQuery false
    // const board = await Board.find({ notInSchema: 1 });

    console.log(board);
    res.send(board);
  } catch (error) {
    console.error(error);

    res.status(500).send({ message: error.message });
  }
});

// 게시글 작성
router.post("/boards", async (req, res) => {
  try {
    const { title, body, userName, password } = req.body;

    // 조기 리턴
    if (Object.keys(req.body).length !== 4) {
      return res.send({ message: "파라미터를 확인하세요" });
    }

    const boards = await Board.create({
      title,
      body,
      userName,
      password,
    });

    // res.json({boards});
    // res.json(boards);
    res.send(boards);
  } catch (error) {
    console.error(error);

    res.status(500).send({ message: error.message });
  }
});

// 특정 게시글 수정
// 비밀번호 비교 후 비밀번호 일치할 때만 수정
router.put("/boards/:boardId", async (req, res) => {
  // boardId 값 다르게 주고 try catch 빼고 실행
  try {
    const { boardId } = req.params;
    const { title, body, userName, password } = req.body;

    // 조기 리턴
    const board = await Board.findById(boardId);
    if (board === null) {
      return res.status(400).send({ message: "🛑 게시글이 없습니다." });
    }

    if (Object.keys(req.body).length !== 4) {
      return res.status(400).send({ message: "파라미터를 확인하세요" });
    }

    const { password: _password } = await Board.findById(boardId, "password");
    if (_password !== password) {
      return res.status(400).send({ message: "비밀번호를 확인하세요" });
    }

    const result = await Board.findByIdAndUpdate(
      boardId,
      { title, body, userName, password },
      {
        new: true,
      }
    );

    console.log("result", result);

    res.send({ message: "success" });
  } catch (error) {
    console.error(error);

    res.status(500).send({ message: error.message });
  }
});

// 특정 게시글 삭제
router.delete("/boards/:boardId", async (req, res) => {
  try {
    const { boardId } = req.params;
    const { password } = req.body;
    // 오류 테스트용
    // const boardId = "63a11f34dee1fb38182cdb93234234";

    // 조기 리턴
    const _board = await Board.findById(boardId);
    if (_board === null) {
      return res.status(400).send({ message: "🛑 게시글이 없습니다." });
    }

    if (Object.keys(req.body).length !== 1) {
      return res.status(400).send({ message: "파라미터를 확인하세요" });
    }

    const { password: _password } = await Board.findById(boardId, "password");
    if (_password !== password) {
      return res.status(400).send({ message: "비밀번호를 확인하세요" });
    }

    // 게시글 삭제
    const board = await Board.findByIdAndDelete(boardId);
    // 게시글에 속한 댓글들 삭제
    const comments = await Comment.deleteMany({ boardId });

    console.log(comments);

    res.send(board);
  } catch (error) {
    console.error(error);

    res.status(500).send({ message: error.message });
  }
});

// 전체 게시글 삭제
router.delete("/boards", async (req, res) => {
  try {
    const board_delete_result = await Board.deleteMany();
    const comment_delete_result = await Comment.deleteMany();

    console.log("board_delete_result", board_delete_result);
    console.log("comment_delete_result", comment_delete_result);

    if (board_delete_result.deletedCount > 0) {
      return res.send({ message: "success" });
    } else {
      return res.send({ message: "nothing to delete" });
    }
  } catch (error) {
    console.error(error);

    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
