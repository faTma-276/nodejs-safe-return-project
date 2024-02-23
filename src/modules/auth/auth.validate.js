import Joi from "joi";
import * as Validation from '../../utils/globalJoiFields.js';

const signUpSchema =Joi.object({
    Fname:Joi.string().min(2).max(20).required(),
    Lname:Joi.string().min(2).max(20).required(),
    email:Validation.emailValidation,
    password:Validation.passwordValidation,
    confirmPassword:Joi.string().required().valid(Joi.ref('password')).messages({
        'any.only': 'Passwords must match',}),
})


const signInSchema =Joi.object({
    email:Validation.emailValidation,
    password:Validation.passwordValidation,
})

const resetPasswordSchema =Joi.object({
    password:Validation.passwordValidation,
    confirmPassword:Joi.string().required().valid(Joi.ref('password')).messages({
        'any.only': 'Passwords must match',}),
    token:Joi.required()
})


const forgetPasswordSchema =Joi.object({
    email:Validation.emailValidation,
})


export{
    signUpSchema,
    signInSchema,
    resetPasswordSchema,
    forgetPasswordSchema
}



