const express = require('express')
const Sequelize = require('sequelize')
const sequelize = new Sequelize('postgres://usuario:senha@localhost:5432/sereducacional')

const app = express()

const port = 3000

app.use(express.json());

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

// criando REST API

app.get('/v1/contatos', async (req, res) => {
	try {
		const contatos = await Contato.findAll();
		res.json({contatos});
	} catch (error) {
		console.log(error);
	}
});

app.post('/v1/contatos', async (req, res) => {
	try {
		const novo = new Contato(req.body);
		await novo.save();
		res.json(novo);
	} catch (error) {
		console.log(error);
	}
});

app.get('/v1/contatos/:id', async (req, res) => {
	try {
		const contato = await Contato.findAll({where: {id: req.params.id}});
		if(contato.length == 0) {
			res.status(404).send('Contato não encontrado');
		} else {
			res.json(contato[0]);
		}
	} catch (error) {
		console.log(error);
	}
});

app.delete('/v1/contatos/:id', async (req, res) => {
	try {
		await Contato.destroy ({where: {id: req.params.id}});
		res.status(204).send('Contato removido com sucesso');
	} catch(error) {
		console.log(error);
	}
});

app.patch('/v1/contatos/:id', async (req,res) => {
	try {
		await Contato.update(req.body, {where: {id: req.params.id}});
		res.status(204).send('Contato atualizado com sucesso');
	} catch (error) {
		console.log(error);
	}
		
});

app.listen(port, () => console.log(`Escutando na porta ${port}!`))
