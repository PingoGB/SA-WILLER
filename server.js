const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const ARQUIVO = './usuarios.json';

// Lê os usuários do arquivo, se não existir começa com array vazio
function lerUsuarios() {
  if (!fs.existsSync(ARQUIVO)) return [];
  const conteudo = fs.readFileSync(ARQUIVO, 'utf-8');
  return JSON.parse(conteudo);
}

// Salva os usuários no arquivo
function salvarUsuarios(usuarios) {
  fs.writeFileSync(ARQUIVO, JSON.stringify(usuarios, null, 2));
}

// Rota POST - cadastro de usuário
app.post('/cadastro', (req, res) => {
  const { email, senha } = req.body;
  const usuarios = lerUsuarios();

  const jaExiste = usuarios.find(u => u.email === email);
  if (jaExiste) {
    return res.status(409).send('Email já cadastrado');
  }

  usuarios.push({ email, senha });
  salvarUsuarios(usuarios);
  console.log('Usuário cadastrado:', email);
  res.send('Cadastro realizado com sucesso');
});

// Rota POST - login de usuário
app.post('/login', (req, res) => {
  const { email, senha } = req.body;
  const usuarios = lerUsuarios();

  const usuario = usuarios.find(u => u.email === email && u.senha === senha);
  if (!usuario) {
    return res.status(401).send('Email ou senha inválidos');
  }

  console.log('Login realizado:', email);
  res.send('Login recebido');
});

// Rota GET - lista todos os usuários
app.get('/usuarios', (req, res) => {
  const usuarios = lerUsuarios();
  res.json(usuarios);
});

// Rota DELETE - deleta um usuário pelo email
app.delete('/usuarios/:email', (req, res) => {
  const { email } = req.params;
  let usuarios = lerUsuarios();

  const existe = usuarios.find(u => u.email === email);
  if (!existe) {
    return res.status(404).send('Usuário não encontrado');
  }

  usuarios = usuarios.filter(u => u.email !== email);
  salvarUsuarios(usuarios);
  res.send('Usuário deletado com sucesso');
});

app.listen(3000, () => {
  console.log('Server rodando na porta 3000');
});