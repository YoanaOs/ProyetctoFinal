import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();



const usuarios =[{
    user:"a",
    email: "a@a.com",
    password: "$2a$05$Z1NJF2d5vAkkL1WtzeuwTOesUwSlRqe4Z/IJe4sM8TrFlPhJ.6fWK"
},
{
    user: 'juan',
    email: 'a@algo.com',
    password: '$2a$05$cEGjszrX4nailCjAEycjuOF4Ecf09dIGOG74MPzHs/RIJ1cOLZfN.'
},
{
  user: 'Yoana',
  email: 'yoanaosuna455@gmail.com',
  password: '$2a$05$x0mdUmTAeDZkNpHhBIT8veRIAn47aGsqwO1v353zoSVnyR1Ew8Ypi'
},
{
  user : "silver",
  email : "silver@gmail.com",
  password : "$2a$05$E4.UA4XMcBiR/wXTiZNt2Oes7ZmsgTnVnd5TiGBMq42eQBsgdjkh."
}]

async function login(request, response){
    console.log(request.body);
  const user = request.body.user;
  const password = request.body.password;
  if(!user || !password){
    return response.status(400).send({status:"Error",message:"Los campos están incompletos"})
  }
  const usuarioAResvisar = usuarios.find(usuario => usuario.user === user);
  if(!usuarioAResvisar){
    return response.status(400).send({status:"Error",message:"Error de usuario"})
  }
  const loginCorrecto = await bcryptjs.compare(password,usuarioAResvisar.password);
  if(!loginCorrecto){
    return response.status(400).send({status:"Error",message:"Error de contraseña"})
  }
  const token = jsonwebtoken.sign(
    {user:usuarioAResvisar.user},
    process.env.JWT_SECRET,
    {expiresIn:process.env.JWT_EXPIRATION});

    const cookieOption = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
      path: "/"
    }
    response.cookie("jwt",token,cookieOption);
    response.send({status:"ok",message:"Usuario loggeado",redirect:"/admin"});


  }



async function register(request, response){
    console.log(request.body);
    const user = request.body.user;
    const password = request.body.password;
    const email = request.body.email;
    
    if (!user || !password || !email){
        return response.status(400).send({estatus: "Error", message:"Los campos estan incompletos"})
    }
    const usuarioARevisar = usuarios.find(usuario => usuario.user === user);
    if(usuarioARevisar){
        return response.status(400).send({status: "error", message: "este usuario ya existe"})
    }

    const salt = await bcryptjs.genSalt(5);
    const hashpassword = await bcryptjs.hash(password, salt);
    const nuevoUsuario = {
        user, email, password: hashpassword
    }
    usuarios.push(nuevoUsuario);
    console.log(usuarios);
    return response.status(201).send({status: "ok", message:`usuario ${nuevoUsuario.user} agregado`, redirect:"/"})

}

export const methods = {
login, 
register,

}