import dotenv from "dotenv";
import express, { Request, Response, Application } from "express";
import mongoose from "mongoose";
import apiRouter from "./src/index";

dotenv.config();

// Swagger
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Import Swagger options
import { swaggerOptions } from "./config/swagger";

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Swagger configuration
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(express.json());

// Routes
app.use("/api", apiRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/api-docs.json', (req: Request, res: Response) => {
  res.json(swaggerSpec);
});

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World!, This is MorphoChains Backend....");
});

// MongoDB connection
const connectDB = async (): Promise<void> => {
  try {
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL environment variable is not defined");
    }
    
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

// Start server
const startServer = async (): Promise<void> => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
  });
};

startServer().catch(console.error);