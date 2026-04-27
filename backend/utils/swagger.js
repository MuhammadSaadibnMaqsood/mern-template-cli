import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MERN API Documentation",
      version: "1.0.0",
      description: "Auto-generated documentation for your MERN stack project",
    },
    servers: [{ url: "http://localhost:5000" }],
  },
  apis: ["./routes/*.js"], // Path to the API docs
};

export default swaggerJsdoc(options);
