const { getAllFeedbacksHandler, addFeedbackHandler } = require("./handler");

module.exports = [
  {
    method: "GET",
    path: "/feedback",
    handler: getAllFeedbacksHandler
  },
  {
    method: "POST",
    path: "/feedback",
    handler: addFeedbackHandler
  },
];
