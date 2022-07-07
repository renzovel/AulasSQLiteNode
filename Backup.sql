--
-- File generated with SQLiteStudio v3.3.3 on ter. jul. 5 20:47:22 2022
--
-- Text encoding used: UTF-8
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: atendente
CREATE TABLE atendente (idatendente INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR);
INSERT INTO atendente (idatendente, nome) VALUES (1, 'Calletano Cuento');

-- Table: cliente
CREATE TABLE cliente (idcliente INTEGER PRIMARY KEY, nome CHAR NOT NULL, cpf CHAR);
INSERT INTO cliente (idcliente, nome, cpf) VALUES (1, 'Daniel Pancracio', '85469778545');

-- Table: mesa
CREATE TABLE mesa (idmesa INTEGER PRIMARY KEY AUTOINCREMENT, numcad INTEGER);
INSERT INTO mesa (idmesa, numcad) VALUES (1, 25);

-- Table: pedido
CREATE TABLE pedido (idpedido INTEGER PRIMARY KEY AUTOINCREMENT, data DATETIME NOT NULL, idmesa INTEGER REFERENCES mesa (idmesa), idcliente INTEGER REFERENCES cliente (idcliente), idatendente INTEGER REFERENCES atendente (idatendente));
INSERT INTO pedido (idpedido, data, idmesa, idcliente, idatendente) VALUES (1, '2022-07-05 23:40:55', 1, 1, 1);

-- Table: pedidoproducto
CREATE TABLE pedidoproducto (idpedidoproduto INTEGER PRIMARY KEY AUTOINCREMENT, quantidade DECIMAL (10, 2), idpedido INTEGER REFERENCES pedido (idpedido), idproduto INTEGER REFERENCES produto (idproduto));
INSERT INTO pedidoproducto (idpedidoproduto, quantidade, idpedido, idproduto) VALUES (1, 2, 1, 1);
INSERT INTO pedidoproducto (idpedidoproduto, quantidade, idpedido, idproduto) VALUES (2, 2, 1, 2);

-- Table: produto
CREATE TABLE produto (idproduto INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR, valor DECIMAL (10, 2));
INSERT INTO produto (idproduto, nome, valor) VALUES (1, 'cocacola', 10.25);
INSERT INTO produto (idproduto, nome, valor) VALUES (2, 'agua', 20.15);

COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
