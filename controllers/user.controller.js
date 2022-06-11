const res = require("express/lib/response");
const User = require("../schemas/user.schema");

function getUsers(req, res) {
  //users
  User.find({}, (error, users) => {
    if (error) {
      return res.status(500).send({
        ok: false,
        message: `Error al obtener usuarios`,
      });
    }

    if (users.length === 0) {
      return res.status(404).send({
        ok: true,
        message: `No se encontró ningun usuario`,
      });
    }

    return res.status(200).send({
      ok: true,
      message: `Usuarios obtenidos correctamente`,
      users: users,
    });
  });
}

function getUser(req, res) {
  return res.send({
    user: {
      name: "Jose",
      lastName: "Perez",
      age: 40,
      active: true,
    },
  });
}




async function createUser(req, res) {
  try {
    console.log(req.body);
    //Formateo la data proveniente en un documento compatible con mi base de datos MONGO
    let user = new User(req.body);

    console.log(user)
    const newUser = await user.save();

    newUser.password = undefined;

    return res.send({ 
      message: `Se creará un NUEVO USUARIO`,
     user: newUser
    });


  } catch (error) {
    console.log('Error');
    return res.send({
      ok: false,
      message: `Error al crear usuario`,
      error
    })
  }
}




function deleteUser(req, res) {
  return res.status(200).send({
    message: "El usuario será BORRADO",
  });
}

const updateUser = (req, res) => {
  return res.status(200).send({
    message: "El usuario será ACTUALIZADO",
  });
};

const login = function (req, res) {
  return res.send({ message: "Login de usuario" });
};

module.exports = {
  getUser,
  createUser,
  deleteUser,
  updateUser,
  login,
  getUsers,
};
