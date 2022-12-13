import { Request, Response, Application } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJSDoc.Options = {

  definition: {
    openapi: "3.0.0",
    info: {
      title: "Swagger API Documentation for Smoove App",
      version: "1.0.0",
      description: "Documenting various apis for Smoove App",
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
    host: "localhost:4000",

    basePath: "/",

  },

  apis: ["../src/routes"],

};



const swaggerSpec = swaggerJSDoc(options);

export  const swaggerDoc = async (app:Application)=>{
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.get("/docs.json", (req: Request, res: Response) => {
  
      res.setHeader("content-Type", "application/json");
  
      res.send(swaggerSpec);
  
    });
  
  
  
    console.log(`Docs available at http://localhost:${4000}/api-docs`);

}