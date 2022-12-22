import joi from "joi";

export const userSchemma = joi.object({
    name: joi.string().min(1).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    confirmPassword: joi.any().valid(joi.ref('password')).required()
});