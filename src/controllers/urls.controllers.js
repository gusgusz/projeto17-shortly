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

export async function showUrl(req,res){
    const id = req.params.id;

    try{
        const body = (await connectionDb.query(
            `SELECT * FROM urls WHERE id=$1`,
            [id]
        )).rows[0];
        if(!body){
            res.status(404).send("URL não encontrada!");
            return;
        }
        delete body.userId;
        delete body.createdAt; 
        delete body.visitCount;   
        res.send(body);
    }catch(err){
        console.log(err.message);
        res.sendStatus(500);
    }
}

export async function openUrl(req,res){
    const shortUrl = req.params.shortUrl;
    try{
        const body = (await connectionDb.query(
            `SELECT * FROM urls WHERE "shortUrl"=$1;`,
            [shortUrl]
        )).rows[0];

        if(!body){
            res.status(404).send("Url não encontrada!");
            return;
        }
        await connectionDb.query(
            `UPDATE urls SET "visitCount"="visitCount" + 1 WHERE "shortUrl"=$1;`,
            [shortUrl]

        );
        res.redirect(body.url);

    }catch(err){
        console.log(err.message);
        res.sendStatus(500);
    }
}