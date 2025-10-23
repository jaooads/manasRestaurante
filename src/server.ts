import express from "express";
import cors from "cors";
import path from "path";
import { pathToFileURL } from "url";

const app = express();
app.use(cors());
app.use(express.json());

// Corrige __dirname no ES Modules
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve arquivos estáticos do front
app.use(express.static(path.join(__dirname, "./front")));

// Rota raiz
app.get("/", (req, res) => res.send("API ManasRestaurante rodando!"));

// Função para iniciar o backend
export async function startServer() {
    try {
        // Import dinâmico do banco de dados
        const dbModule = await import(
            pathToFileURL(path.join(__dirname, "database/index.js")).href
        );
        await dbModule.connectDB();
        console.log("Banco de dados conectado!");

        // Import dinâmico das rotas
        const routesModule = await import(
            pathToFileURL(path.join(__dirname, "route.js")).href
        );
        app.use("/api", routesModule.default);

        // Inicia servidor
        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
            console.log(`Abra o frontend em: http://localhost:${PORT}/index.html`);
        });
    } catch (err) {
        console.error("Erro ao iniciar servidor:", err);
    }
}

// Inicia automaticamente se chamado direto (não obrigatório, mas útil em dev)
if (process.env.NODE_ENV !== "electron") {
    startServer();
}
