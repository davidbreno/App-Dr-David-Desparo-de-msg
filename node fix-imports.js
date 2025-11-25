import fs from "fs";
import path from "path";

const root = "./src";

// Liste aqui todos os types que devem ser importados como "type"
const TYPES = [
  "Patient",
  "Dentist",
  "Appointment",
  "Visit",
  "MessageTemplate",
  "UserData",
  "Clinic",
  "Procedure",
  "Message",
  "Record",
  "Payment",
  "Finance",
  "Stock",
  "Inventory",
];

// Gera regex automaticamente
const regexList = TYPES.map((t) => ({
  type: t,
  regex: new RegExp(`import\\s*\\{\\s*${t}\\s*\\}\\s*from\\s*['"](.*)['"]`, "g"),
}));

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))) {
      fixFile(fullPath);
    }
  }
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let originalContent = content;
  let changed = false;

  for (const { type, regex } of regexList) {
    content = content.replace(regex, (match, pathStr) => {
      changed = true;
      return `import type { ${type} } from '${pathStr}'`;
    });
  }

  if (changed) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✔ Corrigido: ${filePath}`);
  }
}

console.log("🔍 Vasculhando o reino em busca de imports errados…");
walk(root);
console.log("🌱 Finalizado, meu Rei. Todo o seu código está organizado como deve ser.");
