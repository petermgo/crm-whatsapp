const express = require("express")
const cors = require("cors")
const multer = require("multer")
const XLSX = require("xlsx")
const Database = require("better-sqlite3")

const app = express()

app.use(cors())
app.use(express.json())

const upload = multer({ dest: "uploads/" })

// banco de dados
const db = new Database("clients.db")

// criar tabela
db.prepare(`
CREATE TABLE IF NOT EXISTS clients (
id INTEGER PRIMARY KEY AUTOINCREMENT,
nome TEXT,
telefone TEXT,
municipio TEXT,
endereco TEXT,
modelo TEXT,
chassi TEXT,
anoFabricacao TEXT
)
`).run()


// listar clientes
app.get("/clients", (req, res) => {

const clients = db.prepare(`
SELECT * FROM clients
`).all()

res.json(clients)

})


// importar planilha
app.post("/import", upload.single("file"), (req, res) => {

const workbook = XLSX.readFile(req.file.path)

const sheet = workbook.Sheets[workbook.SheetNames[0]]

const rows = XLSX.utils.sheet_to_json(sheet)

const insert = db.prepare(`
INSERT INTO clients
(nome, telefone, municipio, endereco, modelo, chassi, anoFabricacao)
VALUES (?, ?, ?, ?, ?, ?, ?)
`)

for (const row of rows) {

const nome =
row["Nome"] ||
row["Cliente Principal"] ||
row["cliente"] ||
""

let telefone = row["Fone"] || row["Telefone"] || ""

if (telefone) {

telefone = telefone.toString().replace(/\D/g,"")

// adiciona código do Brasil
if (!telefone.startsWith("55")) {
telefone = "55" + telefone
}

}

insert.run(
nome,
telefone,
row["Cidade"] || "",
row["Endereço"] || "",
row["Modelo"] || "",
row["Chassi"] || "",
row["Ano"] || ""
)

}

res.json({
message:"Planilha importada com sucesso"
})

})


// iniciar servidor
app.listen(3001, () => {

console.log("Server running on port 3001")

})