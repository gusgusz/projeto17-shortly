import {connectionDb} from "../database/db.js";
import {userSchemma, loginSchemma} from "../models/users.models.js"
import dayjs from "dayjs";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";


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

export async function login(req,res){
  const { email, password } = req.body;
  const validation = loginSchemma.validate(req.body, {abortEarly: false});

  if(validation.error){
    const errors = validation.error.details.map(m => m.message);
    res.status(422).send(errors);
  }

  try{
    const isUser = (await connectionDb.query(
      "SELECT * FROM users WHERE email=$1;", 
      [email]
    )).rows;

    console.log(isUser);
    const isPassword = await bcrypt.compare(password, isUser[0].password);
    if(isUser.length === 0 || !isPassword){
      res.status(401).send("Usuário ou senha incorretos");
    }
   const isToken = await connectionDb.query(
    `SELECT * FROM tokens WHERE "userId"=$1`,
    [isUser[0].id]
   );
   console.log(isUser[0].id);
   if(isToken.rows.length === 0){
    const token = uuid();
    const createdAt = dayjs().format("YYYY-MM-DDTHH:mm:ss");
    await connectionDb.query(
      `INSERT INTO tokens (token, "userId", "createdAt") VALUES ($1, $2, $3)`,
      [token, isUser[0].id, createdAt]
    );
    res.send(token);
   }
   console.log(isToken.rows[0].token);
   res.send(isToken.rows[0].token);
   
    
  }catch(err){
    console.log(err.message)
    res.status(500).send(err.message);
  }
}