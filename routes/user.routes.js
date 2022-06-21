const express = require('express');
const api = express.Router();
const userController = require('../controllers/user.controller')

api.get('/users/:name?', userController.getUsers);

api.get('/user', userController.getUser);

//Necesito enviar un dato por que necesito traer 1 solo documento (user)
api.get('/users/:userID', userController.getUser);

//Para escribir data en el backend se suele enviar con método POST a través del body.
api.post('/users', userController.createUser);


api.delete('/users/:userToDeleteID', userController.deleteUser);

api.put('/users', userController.updateUser)

api.post('/login', userController.login)

module.exports = api