import { Request, Response, Application } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Swagger API Documentation for Ilearn App",
      version: "1.0.0",
      description:
        "Ilearn is app e-learning app for connecting students to tutor",
      contact: {
        name: "ILearn",
      },
    },

    components: {
      securitySchemas: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerformat: "JWT",
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
    host: process.env.BASE_URL,

    basePath: "/",
  },

  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export const swaggerDoc = async (app: Application) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get("/docs.json", (req: Request, res: Response) => {
    res.setHeader("content-Type", "application/json");

    res.send(swaggerSpec);
  });

  console.log(`Docs available at ${process.env.BASE_URL}/api-docs`);
};
