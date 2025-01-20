"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const route_1 = __importDefault(require("./Routes/route"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: ["https://ocr-adhar.vercel.app/", "http://localhost:5173"],
    credentials: true,
}));
app.use("/", route_1.default);
// Ensure the port is a number, fallback to 10000 if not set
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
