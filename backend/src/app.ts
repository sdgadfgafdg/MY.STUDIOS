import * as express from "express";
import * as cors from "cors";
import "reflect-metadata";
import { config } from "dotenv";
import { AppDataSource } from "./database/data-source";
import sessionRoutes from "./routes/session.routes";

config();

const app = express();
const HOST = process.env.HOST;
const PORT = process.env.PORT;
const FRONT_HOST = process.env.FRONT_HOST;
const FRONT_PORT = process.env.FRONT_PORT;
const FRONT_ADMIN_HOST = process.env.FRONT_ADMIN_HOST;
const FRONT_ADMIN_PORT = process.env.FRONT_ADMIN_PORT;

app.use(
  cors({
    origin: [
      `http://${FRONT_HOST}:${FRONT_PORT}`,
      `http://${FRONT_ADMIN_HOST}:${FRONT_ADMIN_PORT}`,
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", sessionRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("DataSource successfully initialized!");

    app.get("/", (_req, res) => {
      res.send("mystudios backend is running");
    });

    app.listen(PORT, () => {
      console.log(`Server is running at http://${HOST}:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error while initializing AppDataSource:", error);
  });
