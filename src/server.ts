import express from "express";
import { connectDB } from "./database/index";
import routes from './route';
import cors from "cors";
import path from "path";



const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", routes);


app.get("/", (req, res) => res.send("API ManasRestaurante rodando!"));


connectDB();

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
    console.log("Abra o frontend clicando aqui: http://localhost:3000/index.html");
});

app.use(express.static(path.join(__dirname, "./front")));
