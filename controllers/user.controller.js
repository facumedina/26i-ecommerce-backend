const res = require("express/lib/response");
const User = require("../schemas/user.schema");
const bcrypt = require('bcrypt')
const saltRounds = 10;

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
      return res.status(200).send({
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

// function getUser(req, res) {
//   return res.send({
//     message: 'Specific user controller'
//   })
// }

async function getUser(req, res) {
  console.log(req.params)
  // Recibo como param una propiedad userID y la almacenos en la variable id
  const id = req.params.userID;
  // Hago una búsqueda con el método find en la DB pero mando un objecto como primera propiedad del find en el que especifico la propiedad _id tiene que ser igual al id que recibo params.
      //    // User.find({ _id: id }, (error, user) => {
      //    //     console.log(user)
      //    // })
  const user = await User.findById(id)
  if(!user) return res.status(200).send({
      ok: false,
      message: `No se encontró ningún usuario con ese id`
  })
  console.log(`user`, user)

  return res.send({ 
      ok: true,
      message: 'Usuario encontrado',
      user
  })
}


async function createUser(req, res) {
  try {
    console.log(req.body);
    //Formateo la data proveniente en un documento compatible con mi base de datos MONGO
    let user = new User(req.body);
    console.log(`Antes`, user)
    let password = req.body.password;

    const encryptedPassword = await bcrypt.hash(password, saltRounds)
    if(!encryptedPassword) {
        return res.status(500).send({
            ok: false,
            message: 'Error al intentar guardar usuario'
        })
    }
    console.log(`encryptedPassword`, encryptedPassword)
    user.password = encryptedPassword


    console.log(`Despues`, user)


    const newUser = await user.save();

    newUser.password = undefined;

    return res.send({ 
      message: `Se creará un NUEVO USUARIO`,
     user: newUser
    });


  } catch (error) {
    console.log('Error');
    let msg = ``
    if(error.name === 'ValidationError') {
      msg = 'Error en los datos ingresados'
    }
    return res.status(400).send({
      ok: false,
      message: msg,
      error
    })
  }
}




async function deleteUser(req, res) {
  console.log(req.params.userToDeleteId) //627d9128df3426364be30d5e

  const id = req.params.userToDeleteId

  const deletedUser = await User.findByIdAndDelete(id)

  return res.status(200).send({
      message: 'El usuario fue BORRADO',
      deletedUser
  })
}



const updateUser = async (req, res) => {
  
  const id = req.query.idToAndUpdate

  const newUser = await User.findByIdAndUpdate(id, req.body, { new: true })

  return res.status(200).send({
    message: "El usuario fue ACTUALIZADO",
    newUser
  })
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
