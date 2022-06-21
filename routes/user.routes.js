const express = require('express');
const api = express.Router();
const userController = require('../controllers/user.controller');
const jwtVerify = require('../middlewares/jwt');

api.get('/users/:name?', jwtVerify, userController.getUsers);

// api.get('/user', userController.getUser);

//Necesito enviar un dato por que necesito traer 1 solo documento (user)
api.get('/user/:userID', userController.getUser);

//Para escribir data en el backend se suele enviar con método POST a través del body.
api.post('/users', userController.createUser);


api.delete('/users/:userToDeleteID', [jwtVerify, isAdmin], userController.deleteUser);

api.put('/users',jwtVerify, userController.updateUser)

api.post('/login', userController.login)

module.exports = api