const express = require("express")
const cors = require("cors")
const multer = require("multer")
const XLSX = require("xlsx")
const Database = require("better-sqlite3")

const app = express()
const upload = multer({ dest: "uploads/" })

app.use(cors())
app.use(express.json())

// ======================================
// CONTROLE DE ACESSO
// false = bloqueado
// true = liberado
// ======================================
const APP_ACTIVE = true

// Permite apenas a rota raiz quando bloqueado
app.use((req, res, next) => {
  const allowedRoutes = ["/"]

  if (APP_ACTIVE || allowedRoutes.includes(req.path)) {
    return next()
  }

  return res.status(403).json({
    message: "Acesso suspenso por pendência financeira."
  })
})

// ======================================
// BANCO
// ======================================
const db = new Database("clients.db")

db.prepare(`
CREATE TABLE IF NOT EXISTS clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT,
  telefone TEXT,
  municipio TEXT,
  modelo TEXT,
  endereco TEXT
)
`).run()

// ======================================
// ROTAS
// ======================================

// rota raiz
app.get("/", (req, res) => {
  res.send("CRM API rodando")
})

// listar clientes
app.get("/clients", (req, res) => {
  const clients = db.prepare("SELECT * FROM clients").all()
  res.json(clients)
})

// importar planilha
app.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Nenhum arquivo enviado."
      })
    }

    const workbook = XLSX.readFile(req.file.path)
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const data = XLSX.utils.sheet_to_json(sheet)

    const insert = db.prepare(`
      INSERT INTO clients (nome, telefone, municipio, modelo, endereco)
      VALUES (?, ?, ?, ?, ?)
    `)

    for (const row of data) {
      insert.run(
        row["Cliente Principal"] || row["Nome"] || "",
        formatPhone(row["Fone"] || row["Telefone"] || ""),
        row["Cidade"] || row["Município"] || "",
        row["Modelo"] || "",
        row["Endereço"] || row["Endereco"] || ""
      )
    }

    res.json({ message: "Importado com sucesso" })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Erro ao importar planilha."
    })
  }
})

// ======================================
// FUNÇÕES AUXILIARES
// ======================================
function formatPhone(phone) {
  let cleaned = String(phone).replace(/\D/g, "")

  if (cleaned.length === 11 && !cleaned.startsWith("55")) {
    cleaned = `55${cleaned}`
  }

  return cleaned
}

// ======================================
// START
// ======================================
app.listen(3001, () => {
  console.log("Server rodando na porta 3001")
})