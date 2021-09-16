const express = require('express')
const Sequelize = require('sequelize')
const dotenv = require("dotenv-safe");
const jwt = require('jsonwebtoken');

dotenv.config();
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

// Autenticacao

app.post('/v1/login/', async (req, res) => {
	if(req.body.user == 'admin' && req.body.password == 'admin') {
		const id = 232;
		const token = jwt.sign({ id }, process.env.SECRET, {
			        expiresIn: 600
			      });
		return res.json({user: user, status: 'authenticated', token: token});

	} else {
		res.status(401).json({error: 'Usuário ou senha incorreto.'});
	}
});

function authorize(req, res, next) {
	const token = req.headers['x-access-token'];
	if (!token) {
		return res.status(401).json({ error: 'É necessário autenticar-se para realizar essa operação.' });
	}
	jwt.verify(token, process.env.JWT_SECRET, function(error, decoded) {
		if (error) {
			return res.status(500).json({ error: 'Falha na autenticação.' });
		}
		next();
	});
}

// criando REST API

app.get('/v1/contatos', authorize, async (req, res) => {
	try {
		const contatos = await Contato.findAll();
		res.json({contatos});
	} catch (error) {
		console.log(error);
	}
});

app.post('/v1/contatos', authorize, async (req, res) => {
	try {
		const novo = new Contato(req.body);
		await novo.save();
		res.json(novo);
	} catch (error) {
		console.log(error);
	}
});

app.get('/v1/contatos/:id', authorize, async (req, res) => {
	try {
		const contato = await Contato.findAll({where: {id: req.params.id}});
		if(contato.length == 0) {
			res.status(404).json({error: 'Contato não encontrado'});
		} else {
			res.json(contato[0]);
		}
	} catch (error) {
		console.log(error);
	}
});

app.delete('/v1/contatos/:id', authorize, async (req, res) => {
	try {
		await Contato.destroy ({where: {id: req.params.id}});
		res.status(204).json({error: 'Contato removido com sucesso'});
	} catch(error) {
		console.log(error);
	}
});

app.patch('/v1/contatos/:id', authorize, async (req,res) => {
	try {
		await Contato.update(req.body, {where: {id: req.params.id}});
		res.status(204).json({error: 'Contato atualizado com sucesso'});
	} catch (error) {
		console.log(error);
	}
		
});

app.listen(port, () => console.log(`Escutando na porta ${port}!`))
