const express= require('express');
const sqlite3= require('sqlite3');
const app = express();
const port= 3005;
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);

app.use(express.json());
app.use(express.urlencoded());

const db = new sqlite3.Database('./MyDatabase.db', (err) => {
    if (err) {
        console.log("Erro ao abrir base de dados " + err.message);
    } else {
        console.log("Conectado com o Banco de Dados")
    }
})
// ver slide 79 

app.post("/cliente", (req, res, next) => {
    db.run("INSERT INTO cliente(nome,cpf) VALUES(?,?)",
    [req.body.nome, req.body.cpf],
    function(err, result){
        if(err) {
            res.status(400).json({ "error": err.message })
            return;
        }
        res.status(201).json({
            "ID": this.lastID
        })
    })
})


// cadastro de usuario com senha criptografada
app.post("/cadastro", (req, res, next) => {
    var senhaCriptografada = bcrypt.hashSync(req.body.senha, salt) 
    db.get("SELECT senha FROM cliente WHERE cliente.username = (?)",
     [req.body.username], (err, rows) => {  
        if (err) {        
            db.run("INSERT INTO cliente (nome, cpf, username, senha) VALUES(?,?,?,?)",
            [req.body.nome, req.body.cpf, req.body.username, senhaCriptografada],
            function(err, result){
                if(err) {
                    res.status(400).json({ "error": err.message })
                    return;
                }
                res.status(201).json({
                    "ID do Usuario Cadastrado": this.lastID
                })
            })     
        } else {    
            res.json({ error: "Usuário ja cadastrado"}) 
        }
    })    
})

/** 
 * Criar as seguintes rotas:
Exclusão de um usuário baseado no seu ID
Aumento ou desconto de um produto inserindo a porcentagem, opção desejada e o id do preço (PUT ou PATCH?)
Apresentar média dos preços dos produtos
Junto com as rotas adicionar as seguintes funções e mensagens de erro:
Impedir que usuários que possuem um ID par sejam excluídos
Impedir descontos maiores que 75% e aumentar  5% do valor antigo
Impedir acréscimo menores que 5% e descontar 10,75% do valor antigo
Dica: Função match, ler
1 - Criar um sistema de login e senha
2 - Impedir que usuário já cadastrado anteriormente faça um novo cadastro
3 - As senha sempre devem ter os seguintes critérios:
Maiores que 8 caracteres
Letras maiúsculas e minúsculas
Caracteres Especiais **/

const validar=(req, res, next)=>{
    const id = req.params.id;
    if(id%2==0){
        res.status(400).json({ "error": "O numero de id nao pode ser par" })
    }else{
        next();
    }
}

app.delete("/:id", validar, (req, res)=>{
    const id = req.params.id;
    db.run("DELETE FROM cliente WHERE idcliente = (?)",[id],
    (err, rows)=>{
        if(err){
            res.send({error:err});
        }else{
            res.send("Usuario foi deletado");
        }
    })
});



const confirmaLogin = (req, res, next) => {
    db.get("SELECT senha FROM cliente WHERE cliente.username = (?)",
     [req.body.username], (err, rows) => {
            if (err) { 
                res.json({ error: "Erro no sistema."});
            }else{
                if (rows===undefined) {     
                    res.json({ error: "Usuário não cadastrado"})          
                } else {             
                    const seValido = bcrypt.compareSync(req.body.senha, rows.senha);          
                    if (seValido) {
                        next()                  
                    } else {
                        res.json({ error: "Senha Inválida"})                  
                    }
                }
            }
        })
    }

app.post("/login", confirmaLogin, (req, res) =>  {
    res.send("Bem-vindo " + req.body.username)
})


app.get("/:tabela/:id", (req, res, next) => {
    const id = req.params.id;
    const tabela = req.params.tabela;
    db.all(`SELECT * FROM ${tabela} WHERE id${tabela}=${id}`,
    function(err, result){
        if(err) {
            res.status(400).json({ "error": err.message })
            return;
        }
        res.send(result);
    })
})

app.get("/:tabela", (req, res, next) => {
    const id = req.params.id;
    const tabela = req.params.tabela;
    db.all(`SELECT * FROM ${tabela}`,
    function(err, result){
        if(err) {
            res.status(400).json({ "error": err.message })
            return;
        }
        res.send(result);
    })
})


app.listen(port, console.log(`http://localhost:${port}`));
