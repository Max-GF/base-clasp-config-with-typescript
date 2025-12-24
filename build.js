import { execSync } from "child_process";
import { build } from "esbuild";
import fs from "fs";
import path from "path";

async function runBuild() {
  console.log("🚀 Iniciando Build...");

  // 1. Limpeza
  if (fs.existsSync("dist")) {
    fs.rmSync("dist", { recursive: true, force: true });
  }
  fs.mkdirSync("dist");
  console.log("📂 Pasta dist recriada pelo Node.");

  // 2. Build do Frontend (Vite)
  console.log("🎨 Construindo Frontend...");
  try {
    execSync("vite build", { stdio: "inherit" });
  } catch (e) {
    console.error("❌ Erro no Vite.");
    process.exit(1);
  }

  // 3. Build do Backend (Esbuild em Memória)
  console.log("⚙️ Compilando Backend na memória...");

  try {
    const result = await build({
      entryPoints: ["src/back-end/infra/main.ts"],
      bundle: true,
      outfile: "dist/Code.js",
      platform: "browser",
      target: "es2019",
      format: "esm",
      write: false,
    });

    // O Node.js pega o texto compilado da memória
    const codigoCompilado = result.outputFiles[0].text;

    // O Node.js escreve o arquivo
    fs.writeFileSync(path.join("dist", "Code.js"), codigoCompilado);

    console.log("✅ Backend salvo em dist/Code.js com sucesso.");
  } catch (e) {
    console.error("❌ Erro no Esbuild:", e);
    process.exit(1);
  }

  // 4. Copiar Manifesto
  if (fs.existsSync("appsscript.json")) {
    fs.copyFileSync("appsscript.json", "dist/appsscript.json");
    console.log("📄 Manifesto copiado.");
  }

  console.log("🎉 Build Finalizado!");
}

runBuild();
