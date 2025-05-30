const {
  getAllFeedbacksHandler,
  addFeedbackHandler,
  getAllStoryPostsHandler,
  addStoryPostHandler,
  getStoryById,
  getStoryCommentsHandler,
  addStoryCommentHandler,
  getPrediction,
  getEmotionsByUserIdHandler,
  postEmotionHandler,
  getStoryByUsernameHandler,
  getEmotionById,
  getFeedbackRecommendation,
} = require("./handler");

const generateRandomUsername = require("./utils/generateRandomUsername");

module.exports = [
  {
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return h
        .response({
          status: "success",
          message: "Welcome to the Rasa Kata API",
        })
        .code(200);
    },
    options: {
      auth: false, // No authentication required for the root endpoint
    },
  },
  {
    method: "GET",
    path: "/api/feedback",
    handler: getAllFeedbacksHandler,
  },
  {
    method: "GET",
    path: "/api/feedback/{emotionCode}",
    handler: getFeedbackRecommendation,
  },
  {
    method: "POST",
    path: "/api/feedback",
    handler: addFeedbackHandler,
  },
  {
    method: "GET",
    path: "/api/story",
    handler: getAllStoryPostsHandler,
  },
  {
    method: "POST",
    path: "/api/story",
    handler: addStoryPostHandler,
  },
  {
    method: "GET",
    path: "/api/story/{id}",
    handler: getStoryById,
  },
  {
    method: "GET",
    path: "/api/story/{id}/comments",
    handler: getStoryCommentsHandler,
  },
  {
    method: "POST",
    path: "/api/story/{id}/comments",
    handler: addStoryCommentHandler,
  },
  {
    method: "GET",
    path: "/api/random",
    handler: (request, h) => {
      return h.response({
        status: "success",
        username: generateRandomUsername(),
      });
    }
  },
  {
    method: "POST",
    path: "/api/predict",
    handler: getPrediction
  },
  {
    method: "GET",
    path: "/api/emotion/{userId}/user",
    handler: getEmotionsByUserIdHandler
  },
  {
    method: "GET",
    path: "/api/emotion/{id}",
    handler: getEmotionById,
  },
  {
    method: "POST",
    path: "/api/emotion",
    handler: postEmotionHandler
  },
  {
    method: "GET",
    path: "/api/story/{username}/username",
    handler: getStoryByUsernameHandler
  }
];
