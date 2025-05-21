const Jwt = require("@hapi/jwt");
const User = require("../models/User");

const authPlugin = {
  name: "rasa-kata/auth",
  version: "1.0.0",
  register: async function (server, option) {
    await server.register(require("hapi-auth-jwt2"));

    // JWT Strategy Configuration
    server.auth.strategy("jwt", "jwt", {
      key: process.env.JWT_SECRET,
      verify: {
        aud: "urn:audience:rasa-kata",
        iss: "urn:issuer:rasa-kata",
        sub: false,
        nbf: true,
        exp: true,
        maxAgeSec: 14400,
        algorithms: ["HS256"],
      },
      validate: async (artifacts, request, h) => {
        try {
          // 1. Verify token structure
          if (!artifacts) {
            console.error("Invalid token structure");
            return { isValid: false };
          }

          console.log(artifacts);

          // 2. Verify payload has required claims
          const payload = artifacts;
          if (!payload.user) {
            console.error("Missing user claim in token");
            return { isValid: false };
          }

          // 3. Verify user exists in database
          const user = await User.findByEmail(payload.user);
          if (!user) {
            console.error("User not found in database");
            return { isValid: false };
          }

          // 4. Return valid credentials
          return {
            isValid: true,
            credentials: {
              user: {
                id: user.id,
                email: user.email,
                // Add other necessary user fields here
              },
            }
          };
        } catch (error) {
          console.error("JWT Validation Error:", error);
          return { isValid: false };
        }
      }
    });

    server.auth.default("jwt");

    // Token Generation Method
    server.method("generateToken", (user) => {
      try {
        const payload = {
          aud: "urn:audience:rasa-kata",
          iss: "urn:issuer:rasa-kata",
          user: user.email,
          sub: user.id, // Subject (user ID)
          iat: Math.floor(Date.now() / 1000), // Issued at
          exp: Math.floor(Date.now() / 1000) + 14400 // Expires in 4 hours
        };

        return Jwt.token.generate(
          payload,
          {
            key: process.env.JWT_SECRET,
            algorithm: "HS256"
          },
          {
            ttlSec: 14400
          }
        );
      } catch (error) {
        console.error("Token Generation Error:", error);
        throw error;
      }
    });

    // User Authentication Method
    server.method("authenticateUser", async (email, password) => {
      try {
        const user = await User.findByEmail(email);
        if (!user) {
          return { isValid: false };
        }

        const isValid = await User.comparePassword(password, user.password);
        if (!isValid) {
          return { isValid: false };
        }

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        return {
          isValid: true,
          user: userWithoutPassword
        };
      } catch (error) {
        console.error("Authentication Error:", error);
        return { isValid: false };
      }
    });

    // Add debug endpoint for token inspection
    server.route({
      method: "GET",
      path: "/api/auth/debug",
      handler: async (request, h) => {
        return {
          auth: request.auth,
          credentials: request.auth.credentials
        };
      },
      options: {
        auth: "jwt"
      }
    });
  }
};

module.exports = authPlugin;