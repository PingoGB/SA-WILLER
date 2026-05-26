const express = require('express')
const cors = require('cors')
const { Client } = require('pg')

const app = express()

app.use(cors())
app.use(express.json())

// conexão PostgreSQL
const db = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'senai',
  database: 'banco_sa'
})

db.connect()

// cria tabela automaticamente
db.query(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE,
    senha TEXT
  )
`)

// ============================
// CADASTRO
// ============================
app.post('/cadastro', async (req, res) => {
  const { email, senha } = req.body

  try {
    // verifica se já existe
    const existe = await db.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    )

    if (existe.rows.length > 0) {
      return res.status(409).send('Email já cadastrado')
    }

    // cria usuário
    await db.query(
      'INSERT INTO usuarios (email, senha) VALUES ($1, $2)',
      [email, senha]
    )

    console.log('Usuário cadastrado:', email)

    res.send('Cadastro realizado com sucesso')

  } catch (erro) {
    console.log(erro)
    res.status(500).send('Erro no servidor')
  }
})

// ============================
// LOGIN
// ============================
app.post('/login', async (req, res) => {
  const { email, senha } = req.body

  try {
    const resultado = await db.query(
      'SELECT * FROM usuarios WHERE email = $1 AND senha = $2',
      [email, senha]
    )

    if (resultado.rows.length === 0) {
      return res.status(401).send('Email ou senha inválidos')
    }

    console.log('Login realizado:', email)

    res.send('Login realizado com sucesso')

  } catch (erro) {
    console.log(erro)
    res.status(500).send('Erro no servidor')
  }
})

// ============================
// LISTAR USUÁRIOS
// ============================
app.get('/usuarios', async (req, res) => {
  try {
    const resultado = await db.query(
      'SELECT * FROM usuarios'
    )

    res.json(resultado.rows)

  } catch (erro) {
    console.log(erro)
    res.status(500).send('Erro no servidor')
  }
})

// ============================
// DELETAR USUÁRIO
// ============================
app.delete('/usuarios/:email', async (req, res) => {
  const { email } = req.params

  try {
    const existe = await db.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    )

    if (existe.rows.length === 0) {
      return res.status(404).send('Usuário não encontrado')
    }

    await db.query(
      'DELETE FROM usuarios WHERE email = $1',
      [email]
    )

    res.send('Usuário deletado com sucesso')

  } catch (erro) {
    console.log(erro)
    res.status(500).send('Erro no servidor')
  }
})

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000')
})