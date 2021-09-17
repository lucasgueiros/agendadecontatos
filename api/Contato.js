const Sequelize = require('sequelize')
export const sequelize = new Sequelize('postgres://usuario:senha@db:5432/sereducacional');
export const Contato = sequelize.define('contato', {
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
