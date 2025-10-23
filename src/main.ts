import { app, BrowserWindow } from "electron";
import path from "path";
import { existsSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url";

let mainWindow: BrowserWindow | null;

// Corrige __dirname no ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const devServerPath = path.join(__dirname, "../src/server.js");
  const buildServerPath = path.join(__dirname, "server.js");

  const serverPath = existsSync(buildServerPath)
    ? buildServerPath
    : devServerPath;

  if (existsSync(serverPath)) {
    const serverURL = pathToFileURL(serverPath).href;
    await import(serverURL);
    console.log("Servidor iniciado em:", serverPath);
  } else {
    console.error("Servidor não encontrado em:", serverPath);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false,
    },
  });

  const devPath = path.join(__dirname, "../src/front/index.html");
  const buildPath = path.join(__dirname, "front/index.html");
  const indexPath = existsSync(devPath) ? devPath : buildPath;

  mainWindow.loadFile(indexPath);

  mainWindow.on("ready-to-show", () => {
    mainWindow?.show();
    mainWindow?.focus();
  });

  mainWindow.on("focus", () => {
    mainWindow?.webContents.focus();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  await startServer();
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
