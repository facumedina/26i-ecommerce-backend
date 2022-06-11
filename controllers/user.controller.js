const res = require("express/lib/response");
const User = require("../schemas/user.schema");
const bcrypt = require('bcrypt')
const saltRounds = 10;


async function getUsers(req, response) {
  //users
  let criterioDeBusqueda = {}          //con password: 0 estoy diciendo que no quiero que en la lista de usuarios me devuelva la propiedad password.
  const name = req.params.name  //valordevariable

  const page = req.query.page || 0;

  if(name) {
    criterioDeBusqueda = { fullName: new RegExp(name, 'i') } //Con la expresión regular y la i en string no discrimino mayusculas de minusculas y con poner una parte del nombre ya realiza la búsqueda.
  }

  try { //con select lo que voy hacer es traer todas las propiedades del usuario menos la que selecciono dentro.
      // const users = await User.find(criterioDeBusqueda)
      //                         // $and: [ {fullName: new RegExp(name, 'i')},
      //                         //         { age: { $gte: 34} } ],      
                              
      //                         .select({password: 0, __v: 0}) //indica a mongo que no devuelva estos campos.
      //                         .skip(page * items) //Lo utilizo para saltear por cantidad de resultados.
      //                         .limit(3); //con esto me muestra el numero máximo de resultados que me mostrará.

      // const total = await User.find(criterioDeBusqueda).countDocuments();
      
      //     [users, total]
      const resultados = await Promise.all([
        User.find(criterioDeBusqueda)
          .select({password: 0, __v: 0}) //indica a mongo que no devuelva estos campos.
          .skip(page * items) //Lo utilizo para saltear por cantidad de resultados.
          .limit(3) //con esto me muestra el numero máximo de resultados que me mostrará.
          .sort({ fullName:1}) // Me ordena por orden alfabético. con -1 lo hace de forma descendiente.
          .sort({ price: -1}) //ordena de forma descendente.
          .collation({ locale: 'es'}) // el lenguaje para ordenar sin importar mayus y minusc y no haga diferencia entre ellas.
        ,
        User.find(criterioDeBusqueda).countDocuments()

      ])

      const users = resultados[0];
      const total = resultados[1];
      
      
      if(users.length === 0) {
        return res.status(200).send({
            ok: true,
            message: `No se encontró ningun usuario`
        })
    }

    return response.status(200).send({
      ok: true,
      message: `Usuarios obtenidos correcamente`,
      users: users,
      total
    });

  } catch (error) {
    if (error) {
      return res.status(500).send({
        ok: false,
        message: `Error al obtener usuarios`,
      });
    }
  }

}

async function getUser(req, res) {
  console.log(req.params)
  //Recibo como param a una propiedad userID y la almacenamos en la variable id
  const id = req.params.userID
  //Hago una búsqueda con el método find en la DB pero mando un objeto como primera propiedad del find en el que especifica la propiedad _id tiene que ser igual al id que recibo params.
  // User.find({ _id: id }, (error, user) => {
  //   console.log(user)
  // })

  const user = await User.findById(id)
  if(!user) return res.status(200).send({
    ok: false,
    message: `No se encontró nungún usuario con ese id`
  })
  console.log(`user`, user)

  return res.send({
    message: 'Specific user controller',
    urlParams: req.params
  })
}

function getUser(req, res) {
  return res.send({ user: {
    name: "Jose",
    lastName: "Perez",
    age: 40,
    active: true
  }})
}

async function createUser(req, res) {
  try {
      console.log(req.body);
      //Formateo la data proveniente en un documento compatible con mi base de datos MONGO
      let user = new User(req.body);
      console.log(`antes`, user)
      
      let password = req.body.password;

      const encryptedPassword = await bcrypt.hash(password, saltRounds)
      if (!encryptedPassword) {
        return res.status(500).send({
          ok: false,
          message: "Error al intentar guardar usuario",
        })
      }

      console.log(`encryptedPassword`, encryptedPassword)  
      user.password = encryptedPassword

      
      console.log(`despues`, user)


      const newUser = await user.save();

      newUser.password = undefined; //con esta propiedad no le devuelvo al front la contraseña cuando cree un usuario 

      return res.send({ 
        message: `Se creara un NUEVO USUARIO`,
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


// function createUser(req, res) {
//   console.log(req.body)
//   return res.send({ message: `Se creará un nuevo usuario`})
// }


async function deleteUser(req, res) {
  console.log(req.params.userToDeleteId)
  const id = req.params.userToDeleteId
  const deletedUser = await User.findByIdAndDelete(id)

  return res.status(200).send({ 
    message: `El usuario será BORRADO`,
    deletedUser
  })
}



const updateUser = async (req, res) => {

  const id = req.query.idToUpdate

  const newUser = await User.findByIdAndUpdate(id, req.body, { new: true })

  return res.status(200).send({ 
    message: `El usuario fue ACTUALIZADO`,
    newUser
  })
};

const login = async function (req, res) {

  const reqEmail = req.body.email;
  const reqPassword = req.body.password;

  //1ro buscar en la base de datos de usuario si el email existe
  //la propiedad fineOne busca el usuario y el primero que encuentra me lo trae.
  const user = await User.findOne({ email: reqEmail }) 

  //No existe: enviar error e indicar que alguna credencial esta mal o no existe.
  if(user == null) {
    return res.status(404).send({  message: 'No se encontró ningún usuario con ese correo'})
  }

  //si existe voy a comparar el pasword de la base de datos con la password que ingreso la persona en el login.
  //2do : Comparo el password que viene en el request body con el password que tiene el usuario con el email ingresado.

  const checkPassword = await bcrypt.compare(reqPassword, user.password)

  console.log(`Bcrypt compare`, checkPassword)

  if(!checkPassword) {
    return res.status(400).send({ message: 'Credenciales incorrectas'})
  }

  // if(user.password !== reqPassword) {
  //   return res.status(400).send({ message: 'Credenciales incorrectas'})
  // }

        //2do B: para realizar la comparación de un password hasheado uso la función de bcrypt COMPARE.   

  user.password = undefined;
  return res.send({ message: "Login de usuario correcto", body: req.body });
};

module.exports = {
  getUser,
  createUser,
  deleteUser,
  updateUser,
  login,
  getUsers,
};
