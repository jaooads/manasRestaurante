import express from "express";
import { connectDB } from "./database/index";

const app = express();
app.use(express.json());

app.get("/", (req, res) => res.send("API ManasRestaurante rodando!"));

connectDB();

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));