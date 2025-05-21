const db = require("./db");
const axios = require("axios");

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
      message: error,
    });

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
      message: error,
    });

    return response.code(400);
  }
};

const getAllStoryPostsHandler = async (request, h) => {
  try {
    // 1. Fetch all stories (avoid SELECT * for security & performance)
    const { rows: stories } = await db.query(
      "SELECT id, content, anonymous_username, created_at, updated_at FROM story_posts ORDER BY created_at DESC"
    );

    // 2. Get comment counts in a single query (instead of N+1 queries)
    const { rows: commentCounts } = await db.query(
      `SELECT post_id, COUNT(*)::int AS comments_count 
       FROM story_comments 
       WHERE post_id = ANY($1::int[]) 
       GROUP BY post_id`,
      [stories.map((story) => story.id)]
    );

    // 3. Map comment counts to stories efficiently
    const storiesWithComments = stories.map((story) => {
      const commentData = commentCounts.find((c) => c.post_id === story.id);
      return {
        ...story,
        commentsCount: commentData ? commentData.comments_count : 0,
      };
    });

    return h
      .response({
        status: "success",
        data: storiesWithComments,
      })
      .code(200);
  } catch (error) {
    console.error("Error fetching story posts:", error); // Log for debugging
    return h
      .response({
        status: "error",
        message: "Failed to fetch story posts", // Don't expose raw errors
      })
      .code(500); // Use 500 for server errors (400 is for client errors)
  }
};

const getStoryById = async (request, h) => {
  try {
    const { id } = request.params;
    const story = await db.query("SELECT * FROM story_posts WHERE id = $1", [
      id,
    ]);
    const comments = await db.query(
      "SELECT * FROM story_comments WHERE post_id = $1",
      [id]
    );

    if (story.rows.length === 0) {
      return h
        .response({
          status: "error",
          message: "Story not found",
        })
        .code(404);
    }

    const response = h.response({
      status: "success",
      data: {
        ...story.rows[0],
        comments: comments.rows,
      },
    });

    return response.code(200);
  } catch (error) {
    const response = h.response({
      status: "error",
      message: error,
    });

    return response.code(400);
  }
};

const addStoryPostHandler = async (request, h) => {
  try {
    const { content, anonymous_username } = request.payload;
    const timestamp = new Date().toISOString();
    const res = await db.query(
      "INSERT INTO story_posts (content, created_at, updated_at, anonymous_username) VALUES ($1, $2, $3, $4) RETURNING *",
      [content, timestamp, timestamp, anonymous_username]
    );
    return h.response(res.rows[0]).code(201);
  } catch (error) {
    const response = h.response({
      status: "error",
      message: error,
    });

    return response.code(400);
  }
};

const getStoryCommentsHandler = async (request, h) => {
  try {
    const { id } = request.params;
    const data = await db.query(
      "SELECT * FROM story_comments WHERE post_id = $1",
      [id]
    );

    const response = h.response({
      status: "success",
      data: data.rows,
    });

    return response.code(200);
  } catch (error) {
    const response = h.response({
      status: "error",
      message: error,
    });

    return response.code(400);
  }
};

const addStoryCommentHandler = async (request, h) => {
  try {
    const { content } = request.payload;
    const { id } = request.params;
    const timestamp = new Date().toISOString();
    await db.query(
      "INSERT INTO story_comments (post_id, content, created_at, updated_at) VALUES ($1, $2, $3, $4) RETURNING *",
      [id, content, timestamp, timestamp]
    );

    const story = await db.query(
      "SELECT * FROM story_posts WHERE id = $1 ORDER BY created_at DESC",
      [id]
    );

    const comments = await db.query(
      "SELECT * FROM story_comments WHERE post_id = $1 ORDER BY created_at DESC",
      [id]
    );

    return h.response({ ...story.rows[0], comments: comments.rows }).code(201);
  } catch (error) {
    const response = h.response({
      status: "error",
      message: error,
    });

    return response.code(400);
  }
};

const getPrediction = async (request, h) => {
  try {
    const { text } = request.payload;
    const response = await axios.post(
      "https://api.rasakatamodel.live/predict",
      {
        kalimat: text,
      }
    );

    const emotionCode = response.data.label_prediksi;
    const feedbackRecommendation = await db.query(
      "SELECT * FROM feedback_videos WHERE emotion_code = $1 ORDER BY RANDOM() LIMIT 3",
      [emotionCode]
    );

    return h
      .response({
        status: "success",
        data: {
          emotion: response.data.emosi,
          emotionCode: emotionCode,
          feedbackRecommendation: feedbackRecommendation.rows,
        },
      })
      .code(200);
  } catch (error) {
    return h
      .response({
        status: "error",
        message: error.message,
      })
      .code(400);
  }
};

const getEmotionsByUserIdHandler = async (request, h) => {
  try {
    const { userId } = request.params;
    const response = await db.query(
      "SELECT * FROM emotion_histories WHERE user_id = $1",
      [userId]
    );

    return h
      .response({
        status: "success",
        data: response.rows,
      })
      .code(200);

  } catch (error) {
    return h
      .response({
        status: "error",
        message: error.message,
      })
      .code(400);
  }
}

const postEmotionHandler = async (request, h) => {
  try {
    const { user_id, emotion_code } = request.payload;
    const timestamp = new Date().toISOString();
    await db.query(
      "INSERT INTO emotion_histories (user_id, emotion_code, created_at) VALUES ($1, $2, $3)",
      [user_id, emotion_code, timestamp]
    );

    return h
      .response({
        status: "success",
        message: "Emotion recorded successfully",
      })
      .code(201);
  } catch (error) {
    return h
      .response({
        status: "error",
        message: error.message,
      })
      .code(400);
  }
}

module.exports = {
  getAllFeedbacksHandler,
  addFeedbackHandler,
  getAllStoryPostsHandler,
  addStoryPostHandler,
  getStoryById,
  getStoryCommentsHandler,
  addStoryCommentHandler,
  getPrediction,
  getEmotionsByUserIdHandler,
  postEmotionHandler
};
