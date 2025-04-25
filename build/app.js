"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const users_1 = __importDefault(require("./routes/users"));
const db_1 = __importDefault(require("./config/db"));
const books_1 = __importDefault(require("./routes/books"));
const booksOfInterest_1 = __importDefault(require("./routes/booksOfInterest"));
const requests_1 = __importDefault(require("./routes/requests"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}));
app.use(express_1.default.json());
app.use('/users', users_1.default);
app.use("/books", books_1.default);
app.use("/interests", booksOfInterest_1.default);
app.use("/requests", requests_1.default);
app.get('/', (_, res) => {
    res.send("Server is running!");
});
const PORT = process.env.PORT;
(0, db_1.default)();
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
