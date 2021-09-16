const express = require('express')
const Sequelize = require('sequelize')
const sequelize = new Sequelize('postgres://usuario:senha@localhost:5432/sereducacional')

const app = express()

const port = 3000

app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'Hello World' }))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// NOME, SOBRENOME, TELEFONE, DATA DE NASCIMENTO, ENDERECO e EMAIL
const Contato = sequelize.define('contato', {
	nome: {
		type: Sequelize.STRING,
		allowNull: false
	},
	sobrenome: {
		type: Sequelize.STRING,
		allowNull: false
	},
	telefone: {
		type: Sequelize.STRING,
		allowNull: false
	},
	dataDeNascimento:{
		type: Sequelize.DATEONLY,
		allowNull: false
	},
	endereco:{
		type: Sequelize.STRING,
		allowNull: false
	}, 
	email:{
		type: Sequelize.STRING,
		allowNull: false
	}
});
Contato.sync({ force: true });
