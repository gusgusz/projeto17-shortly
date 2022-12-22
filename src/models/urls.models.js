import joi from "joi";

export const urlSchemma = joi.object({
    url: joi.string().min(8).required()
});