const db = require("./db");

const getAllFeedbacksHandler = async (request, h) => {
  const res = await db.query("SELECT * FROM feedback_videos");
  return h.response(res.rows);
};

const addFeedbackHandler = async (request, h) => {
  try {
    const { link, code } = request.payload;
    const res = await db.query(
      "INSERT INTO feedback_videos (youtube_link, emotion_code) VALUES ($1, $2) RETURNING *",
      [link, code]
    );
    return h.response(res.rows[0]).code(201);
  } catch (error) {
    console.log(error);
    return h.response(error).code(400);
  }
};

module.exports = {
  getAllFeedbacksHandler,
  addFeedbackHandler
};
