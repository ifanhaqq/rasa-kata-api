const db = require("../db");

module.exports = [
  {
    method: "POST",
    path: "/api/v2/goal",
    handler: async (request, h) => {
      try {
        const { saving_id, goal, goal_value } = request.payload;
        const savingGoal = await db.query(
          "INSERT INTO saving_goals (saving_id, goal, goal_value) VALUES ($1, $2, $3) RETURNING *",
          [saving_id, goal, goal_value]
        );

        return h
          .response({
            status: "success",
            data: {
              savingGoal: savingGoal.rows[0],
            },
          })
          .code(201);
      } catch (error) {
        console.error("Error creating saving goal:", error);
        return h
          .response({
            status: "error",
            message: "Failed to create saving goal",
          })
          .code(500);
      }
    },
    options: {
        auth: false
    }
  },
  {
    method: "GET",
    path: "/api/v2/goal/{id}",
    handler: async (request, h) => {
      try {
        const { id } = request.params;
        const savingGoal = await db.query(
          "SELECT * FROM saving_goals WHERE saving_id = $1",
          [id]
        );

        if (savingGoal.rows.length === 0) {
          return h
            .response({
              status: "error",
              message: "Saving goal not found",
            })
            .code(404);
        }

        return h
          .response({
            status: "success",
              data: savingGoal.rows,
          })
          .code(200);
      } catch (error) {
        console.error("Error fetching saving goal:", error);
        return h
          .response({
            status: "error",
            message: "Failed to fetch saving goal",
          })
          .code(500);
      }
    },
    options: {
        auth: false
    }
  }
];
