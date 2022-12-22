import {connectionDb} from "../database/db.js";
import {userSchemma} from "../models/users.models.js"
import dayjs from "dayjs";
import bcrypt from "bcrypt";


export async function createUser(req,res){
    const {name, email, password, confirmPassword} = req.body;
    const {error} = userSchemma.validate(req.body, {abortEarly: false});

if(error){
    
    res.status(422).send(error.details[0].message);
    
}
try{
const isUser = await connectionDb.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if(isUser.length > 0){
    res.status(404).send("Este email já esta cadastrado!");
  }

  const createdAt = dayjs().format("YYYY-MM-DDTHH:mm:ss");

  const hashPassword = bcrypt.hashSync(password, 10);

  await connectionDb.query(
    `INSERT INTO users (name, email, password, "createdAt") VALUES ($1, $2, $3, $4)`,
    [name, email, hashPassword, createdAt]
  );

  res.sendStatus(201);

}catch(err){
    console.log(err);
    res.status(500).send(err.message);
}

}