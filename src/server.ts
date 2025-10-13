import express from "express";
import { connectDB } from "./database/index";
import router from "./route.js";


const app = express();
app.use(express.json());
app.use("/api", router);


app.get("/", (req, res) => res.send("API ManasRestaurante rodando!"));


connectDB();

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));