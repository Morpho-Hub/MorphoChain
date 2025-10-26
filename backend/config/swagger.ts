import path from "path";

export const swaggerOptions = {
  definition: {
    openapi: '3.0.3',
    servers: [{ url: 'http://localhost:3000' }],
    info: { 
      title: 'Backend API', 
      version: '1.0.0',
      description: 'MorphoChains Backend API Documentation'
    }
  },
  apis: [ 
    path.resolve(__dirname, "../src/docs/*.js"),
    path.resolve(__dirname, "../src/docs/*.ts"),
    path.resolve(__dirname, "../src/routes/*.ts")
  ],
};