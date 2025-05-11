const db = require("./db");

const getAllFeedbacksHandler = async (request, h) => {
  try {
    const data = await db.query("SELECT * FROM feedback_videos");

    const response = h.response({
      status: "success",
      data: data.rows,
    });

    return response.code(200);
  } catch (error) {
    const response = h.response({
      status: "error",
      message: error
    })

    return response.code(400);
  }
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
    const response = h.response({
      status: "error",
      message: error
    })

    return response.code(400);
  }
};

const getAllStoryPostsHandler = async (request, h) => {
  try {
    const data = await db.query("SELECT * FROM story_posts");

    const response = h.response({
      status: "success",
      data: data.rows,
    });

    return response.code(200);
  } catch (error) {
    const response = h.response({
      status: "error",
      message: error
    })

    return response.code(400);
  }
}

const getStoryById = async (request, h) => {
  try {
    const { id } = request.params;
    const data = await db.query("SELECT * FROM story_posts WHERE id = $1", [id]);

    if (data.rows.length === 0) {
      return h.response({
        status: "error",
        message: "Story not found",
      }).code(404);
    }

    const response = h.response({
      status: "success",
      data: data.rows[0],
    });

    return response.code(200);
  } catch (error) {
    const response = h.response({
      status: "error",
      message: error
    })

    return response.code(400);
  }
}

const addStoryPostHandler = async (request, h) => {
  try {
    const { content } = request.payload;
    const timestamp = new Date().toISOString();
    const res = await db.query(
      "INSERT INTO story_posts (content, created_at, updated_at) VALUES ($1, $2, $3) RETURNING *",
      [content, timestamp, timestamp]
    );
    return h.response(res.rows[0]).code(201);
  } catch (error) {
    const response = h.response({
      status: "error",
      message: error
    })

    return response.code(400);
  }
}

module.exports = {
  getAllFeedbacksHandler,
  addFeedbackHandler,
  getAllStoryPostsHandler,
  addStoryPostHandler,
  getStoryById
};
