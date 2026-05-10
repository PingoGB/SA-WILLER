const express = require ('express');
const cors = require ('cors');

const app = express();
app.use(cors());
app.use(express.json());
/*Cria a rota de login "/login" e o post envia os dados, req.body requere o json
q o frontend manda e o res.send manda a resposta pro front */
app.post ('/login', (req, res)=>{
    console.log(req.body);
    res.send('Login recebido');
})

app.listen(3000, () => {
    console.log('Server rodando na 3000');
})