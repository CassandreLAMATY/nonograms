import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: `.env.local`, override: true });

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Routes
import { LevelUtils } from "./utils/nonogram";
const levelUtils = new LevelUtils();

import { LevelRepository } from "./repositories/nonogram";
const levelRepository = new LevelRepository(levelUtils);

import { LevelService } from "./services/nonogram";
const levelService = new LevelService(levelRepository, levelUtils);

import { NonogramController } from "./controllers";
const nonogramController = new NonogramController(levelService, levelUtils);

import { NonogramRoutes } from "./routes";
const nonogramRoutes = new NonogramRoutes(nonogramController);


app.get("/", (req: Request, res: Response) => {
  res.send("Server running");
});

app.use("/nonogram", nonogramRoutes.router);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});