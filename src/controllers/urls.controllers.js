import { connectionDb } from "../database/db.js";
import { urlSchemma } from "../models/urls.models.js";

export async function shortUrl(req,res){
    const  {userId }= res.locals;

    const {url} = req.body;
    const {error} = urlSchemma.validate(req.body, {abortEarly: false});

    if(error){
        res.status(422).send(error.details[0].message);
    }

 
    res.send(url);
}