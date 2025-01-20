import express from "express";
import dotenv from 'dotenv'
import cors from 'cors'

import router from "./Routes/route";

const app = express();
dotenv.config();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin:["https://ocr-adhar.vercel.app/","http://localhost:5173"],
    credentials:true
}))
app.use('/',router)
const PORT = 8000;
  
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
