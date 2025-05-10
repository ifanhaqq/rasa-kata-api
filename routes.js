const { getAllFeedbacksHandler, addFeedbackHandler } = require("./handler");

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
    path: "/feedback",
    handler: getAllFeedbacksHandler,
  },
  {
    method: "POST",
    path: "/feedback",
    handler: addFeedbackHandler,
  },
];
