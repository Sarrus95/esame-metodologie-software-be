"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const users_1 = __importDefault(require("./routes/users"));
const db_1 = __importDefault(require("./config/db"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/users', users_1.default);
app.get('/', (_, res) => {
    res.send("Server is running!");
});
const PORT = process.env.PORT;
(0, db_1.default)();
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
