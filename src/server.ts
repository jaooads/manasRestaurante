import express from "express";
import { connectDB } from "./database/index";
import routes from './route';


const app = express();
app.use(express.json());
app.use("/api", routes);


app.get("/", (req, res) => res.send("API ManasRestaurante rodando!"));


connectDB();

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));