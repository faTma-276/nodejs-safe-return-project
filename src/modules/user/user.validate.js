import Joi from "joi"
import * as Validation from "../../utils/globalJoiFields.js"

const updateUserSchema = Joi.object({
    Fname:Validation.nameValidation,
    Lname:Validation.nameValidation,
    phoneNumber:Validation.phoneNumberValidation,
    governorate:Validation.governorateValidation,
    date:Validation.dateValidation,
})


const changeUserPasswordSchema = Joi.object({
    oldPassword:Joi.string().min(5).max(35).required(),
    newPassword:Joi.string().min(5).max(35).required(),
    confirmPassword:Joi.string().required().valid(Joi.ref('newPassword')).messages({
        'any.only': 'Passwords must match',}),
})




export {
    changeUserPasswordSchema,
    updateUserSchema
}
