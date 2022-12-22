import { connectionDb } from "../database/db.js";
import { urlSchemma } from "../models/urls.models.js";
import { nanoid } from "nanoid";
import dayjs from "dayjs";

export async function shortUrl(req,res){
    const  {userId }= res.locals;

    const {url} = req.body;
    const {error} = urlSchemma.validate(req.body, {abortEarly: false});

    if(error){
        res.status(422).send(error.details[0].message);
        return;
    }
    const shortUrl = nanoid();
    const createdAt = dayjs().format('YYYY-MM-DDTHH:mm:ss');
    const visitCount = 0;

    try{
        
        await connectionDb.query(
            `INSERT INTO urls ("userId", url, "shortUrl", "visitCount", "createdAt") VALUES ($1,$2, $3, $4, $5)`,
            [userId,url,shortUrl, visitCount, createdAt]
        );
        res.sendStatus(201);

    }catch(err){
        console.log(err.message);
        res.sendStatus(500);
    }

 
   
}