const express= require('express');
const sqlite3= require('sqlite3');
const app = express();
const port= 3005;


app.use(express.json());
app.use(express.urlencoded());

const db = new sqlite3.Database('./MyDatabase.db', (err) => {
    if (err) {
        console.log("Erro ao abrir base de dados " + err.message);
    } else {
        console.log("Conectado com o Banco de Dados")
    }
})


app.post("/cliente", (req, res, next) => {
    console.log("----meus dados----->", req.body);
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
