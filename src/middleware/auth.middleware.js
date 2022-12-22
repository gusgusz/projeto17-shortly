import { connectionDb } from "../database/db.js";


export async function authenticate(req,res,next){
    const authorization = req.headers.authorization;

    if(!authorization){
        res.sendStatus(401);
        return;
    }
    
    const token = authorization?.replace("Bearer ", "");
    console.log(token);
    try{
    const isToken = (await connectionDb.query(
        `SELECT * FROM tokens WHERE token=$1`,
        [token]
    )).rows;

    if(isToken.length === 0){
        res.sendStatus(401);
        return;
    }

    console.log(isToken[0].userId);
    res.locals.userId = isToken[0].userId;
    next();
}catch(err){
    console.log(err.message);
    res.sendStatus(500);
}
}