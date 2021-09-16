const express = require('express')
const Sequelize = require('sequelize')
const sequelize = new Sequelize('postgres://usuario:senha@localhost:5432/sereducacional')

const app = express()

const port = 3000

app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'Hello World' }))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
