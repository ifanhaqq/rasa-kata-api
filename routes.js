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
  },
  {
    method: "GET",
    path: "/api/feedback",
    handler: getAllFeedbacksHandler,
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
    path: "/api/emotion/{userId}",
    handler: getEmotionsByUserIdHandler
  },
  {
    method: "POST",
    path: "/api/emotion",
    handler: postEmotionHandler
  }
];
