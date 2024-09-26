import express, { Response, Request, Application, json } from "express";
import cors from "cors";
import router from "./routers/router";
import errorHandler from "./middleware/errorHandler";
import database from "./config/database";
import { config } from "dotenv";

config();
const app: Application = express();
const PORT = process.env.PORT || 5000;

database().then(() => console.log("Database Connected"));
app.use(cors());
app.use(json());

app.use(router);
app.use(errorHandler);
app.use("*", (req: Request, res: Response) => {
  return res.status(404).json({
    message: "Requested route does not exist",
    data: null,
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
