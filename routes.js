const {
  getAllFeedbacksHandler,
  addFeedbackHandler,
  getAllStoryPostsHandler,
  addStoryPostHandler,
  getStoryById,
} = require("./handler");

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
];
