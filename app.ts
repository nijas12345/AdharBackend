import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import router from "./Routes/route";

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["https://ocr-adhar.vercel.app/", "http://localhost:5173"],
    credentials: true,
  })
);

app.use("/", router);

// Ensure the port is a number, fallback to 10000 if not set
const port = Number(process.env.PORT) || 10000;

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running at http://localhost:${port}`);
});

