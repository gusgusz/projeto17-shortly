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

export async function deleteUrl(req,res){
    const userId = res.locals.userId;
    const urlId = req.params.id;
    console.log(userId," UserId");


    try{
        const isUrl = (await connectionDb.query(
            `SELECT * FROM urls WHERE id=$1`,
            [urlId]
        )).rows[0];
        if(!isUrl){
            res.status(404).send("URL não encontrada!");
            return;
        }
       

        if(isUrl.userId !== userId){
            res.status(401).send("shortUrl não pertence ao usuário!");
            return;
        }

        await connectionDb.query(
            `DELETE FROM urls WHERE id=$1;`,
            [urlId]
        );
        res.sendStatus(204);
       
    }catch(err){
        console.log(err.message);
        res.sendStatus(500);
    }
}

export async function showUserUrls(req,res){
    const userId = res.locals.userId;

    try{
        const isUser = (await connectionDb.query(
            `SELECT * FROM users WHERE id=$1;`,
            [userId]
        )).rows[0];
        console.log(isUser);
        if(!isUser){
            res.status(404).send("Usuário não encontrado");
        }
        const total = (await connectionDb.query(
            `SELECT SUM(urls."visitCount") as VisitCount FROM urls WHERE "userId"=$1;`,
            [userId]
        )).rows[0];
        const urls = (await connectionDb.query(
            `SELECT * FROM urls WHERE "userId"=$1;`,
            [userId]
        )).rows;
            const shortenedUrls = urls.map((url) => {
                delete url.userId;
                delete url.createdAt;
                return url;
            });
        const body = {id: userId, name: isUser.name, ...total,shortenedUrls};

        res.send( body);

    }catch(err){
        console.log(err.message);
        res.sendStatus(500);
    }
}

export async function showRanking(req,res){
    try{
        const ranking = (await connectionDb.query(
            `SELECT users.id, users.name,
             SUM(urls."visitCount") as "visitCount", COUNT(urls."visitCount") AS "linksCount"
              FROM urls JOIN users 
              ON urls."userId"=users.id 
              GROUP BY users.id 
              ORDER BY "visitCount" DESC LIMIT 10 ;`
        )).rows;
        res.send(ranking);
    }catch(err){
        console.log(err.message);
        res.sendStatus(500);
    }
}