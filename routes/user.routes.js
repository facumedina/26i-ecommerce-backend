const express = require("express");
const api = express.Router();
const userController = require('../controllers/user.controller')

api.get('/users/:name?', userController.getUsers);
//NECESITO ENVIAR UN DATO PORQUE NECESITO TRAER 1 SÓLO DOCUMENTO (USER)   //utilizo GET sólo para pedir.
api.get('/user/:userID', userController.getUser);
//Para escribir data en el backend se suele enviar con método POST a través del body.
api.post('/users', userController.createUser);


api.delete('/users/:userToDeleteId', userController.deleteUser);


api.put('/users', userController.updateUser);

api.post('/login', userController.login)

module.exports = api