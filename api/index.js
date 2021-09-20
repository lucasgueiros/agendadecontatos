const express = require('express')
const cors = require('cors');
const Sequelize = require('sequelize')
const dotenv = require('dotenv-safe');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

dotenv.config();
console.log('DBURL is '+process.env.DBURL);
const sequelize = new Sequelize(process.env.DBURL, {
	retry: {
		max: Infinity,
		match: [/SequelizeConnectionRefusedError/],
		backoffBase: 1000,
		backoffExponent: 1.0,
		report: (message, conf) => console.log('Tentando nova conexão: ' + message),
		name: 'Sequelize Connection Retry'
	}
});
const app = express()
const port = 5000
app.use(cors());
app.use(express.json());

// Usuários
const User = sequelize.define('user', {
	username: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true,
	},
	hashedPassword: {
		type: Sequelize.STRING,
		allowNull: false
	},
});

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
	},
});
Contato.belongsTo(User, {
	foreignKey: {
    name: 'ownerId'
  }
});

// Configurando BD
(async () => {
	await User.sync({force: false});
	await Contato.sync({ force: false });
	// Verifique se existe ao menos um Usuário
	User.findAll().then((users) => {
		if(users.length == 0){
			console.log("Nenhum usuário cadastrado, irei criar admin com a senha admin");
			const hashed = bcrypt.hashSync('admin',10);
			const admin = new User ({
				username: 'admin',
				hashedPassword: hashed
			});
			admin.save().then((r) => {
				console.log("Admin com senha admin criado com sucesso");
			});
		}
	});
})();

// Autenticacao
app.post('/v1/register/', async (req, res) => {
	try {
		const hashed = bcrypt.hashSync(req.body.password,10);
		const novo = new User({
			username: req.body.username,
			hashedPassword: hashed
		});

		await novo.save();
		res.json(novo);
	} catch (error) {
		console.log(error);
	}
})

app.post('/v1/login/', async (req, res) => {
	if(req.body.username && req.body.password) {
		User.findAll({where: { username: req.body.username }}).then((users) => {
			if(users.length == 1) {
				const user = users[0];
				bcrypt.compare(req.body.password, user.hashedPassword).then ((result) => {
					if(result) {
						const iat = new Date().getTime() / 1000;
						const payload = {
							iss: 'localhost',
							sub: user.id,
							iat: iat
						};
						console.log(iat);
						const token = jwt.sign(payload, process.env.JWT_SECRET, {
							        expiresIn: 604800 // uma semana
							      });
						return res.json({username: user.username, status: 'authenticated', token: token});
					} else {
						res.status(401).json({error: 'Usuário ou senha incorreto.'});
					}
				})
			}
		}, (e) => {
			res.status(401).json({error: 'Usuário ou senha incorreto.'});
		})
	}
});

function authorize(req, res, next) {
	let token = req.headers['authorization'];
	if (!token) {
		return res.status(401).json({ error: 'É necessário autenticar-se para realizar essa operação.' });
	}
	token = token.slice(7);
	jwt.verify(token, process.env.JWT_SECRET, function(error, decoded) {
		if (error) {
			console.log(error);
			return res.status(401).json({ error: 'Falha na autenticação.' });
		}
		res.locals.userId = decoded.sub;
		next();
	});
}

// criando REST API

app.get('/v1/contatos', authorize, async (req, res) => {
	try {
		// Construindo consulta
		let query = {
			where: {
				ownerId: res.locals.userId
			},
			order: [
				// por padrão, ordene por nome e sobrenome
				['nome','ASC'],['sobrenome','ASC']
			]
		};

		if(req.query.size) {
			if(req.query.size < 1) {
				res.status(422).json({error: 'O parâmetro \'size\' deve ser maior ou igual a um.'});
				return;
			}
			query.limit = req.query.size;
		}
		if(req.query.page) {
			if(req.query.page < 1) {
				res.status(422).json({error: 'O parâmetro \'page\' deve ser maior ou igual a um.'});
				return;
			}
			query.offset = (req.query.page-1) * req.query.size;
		}

		const {rows,count} = await Contato.findAndCountAll(query);
		let total = count;
		let size = total;
		let totalPages = 1;
		if(query.limit) {
			size = query.limit;
			totalPages = total / size;
		}
		let page = 1;

		if(query.offset) {
			page = req.query.page;
		}
		const contatos = rows.map((row) => row.dataValues);
		res.json({contatos, size: size, total: '' + total, page: '' + page, totalPages: '' + totalPages});
	} catch (error) {
		console.log(error);
	}
});

app.post('/v1/contatos', authorize, async (req, res) => {
	try {
		const novo = new Contato({
			...req.body,
			ownerId: res.locals.userId
		});
		await novo.save();
		res.json(novo);
	} catch (error) {
		console.log(error);
	}
});

app.get('/v1/contatos/:id', authorize, async (req, res) => {
	try {
		const contato = await Contato.findAll({where: {id: req.params.id, ownerId: res.locals.userId }});
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
		await Contato.destroy ({where: {id: req.params.id, ownerId: res.locals.userId}});
		res.status(204).json({error: 'Contato removido com sucesso'});
	} catch(error) {
		console.log(error);
	}
});

app.patch('/v1/contatos/:id', authorize, async (req,res) => {
	try {
		await Contato.update(req.body, {where: {id: req.params.id, ownerId: res.locals.userId}});
		res.status(204).json({error: 'Contato atualizado com sucesso'});
	} catch (error) {
		console.log(error);
	}

});

app.listen(port, () => console.log(`Escutando na porta ${port}.`))
