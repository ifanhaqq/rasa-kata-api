const Hapi = require("@hapi/hapi");
const routes = require("./routes");
const authPlugin = require("./plugins/auth");
const auth = require("./routes/auth");
const savingGoals = require("./routes/savingGoals");

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: "0.0.0.0",
    routes: {
      cors: {
        origin: [
          "http://localhost:3307",
          "https://rasakata.me",
          "https://harmonious-gelato-9335cc.netlify.app/",
          "http://localhost:4173/",
        ],
        additionalHeaders: ["cache-control", "x-requested-with"],
      },
    },
  });

  await server.register(authPlugin);

  server.route(auth);

  server.route(routes);

  server.route(savingGoals);

  server.ext("onPreResponse", (request, h) => {
    if (request.response.isBoom) {
      console.error("Error details:", {
        error: request.response.message,
        stack: request.response.stack,
        data: request.response.data,
      });
    }
    return h.continue;
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
