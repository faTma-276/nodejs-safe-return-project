import Joi from'joi';
import * as Validation from '../../utils/globalJoiFields.js';



 const addFoundReportSchema = Joi.object({
    firstReporterName:Validation.nameValidation.required(),
    lastReporterName:Validation.nameValidation.required(),
    phoneNumber:Validation.phoneNumberValidation.required(),
    governorate:Validation.governorateValidation.required(),
    date:Validation.dateValidation.required(),
    childName:Joi.string().min(2).max(40).optional(),
    description:Joi.string().min(2).max(200).optional(),
    age:Joi.number().optional(),
})

const updateFoundReport = Joi.object({
    id:Validation.idValidation,
    firstReporterName:Validation.nameValidation,
    lastReporterName:Validation.nameValidation,
    phoneNumber:Validation.phoneNumberValidation,
    governorate:Validation.governorateValidation,
    date:Validation.dateValidation,
    childName:Joi.string().min(2).max(40).optional(),
    description:Joi.string().min(2).max(200).optional(),
    age:Joi.number().optional(),
})



const deleteFoundReport = Joi.object({

    id:Validation.idValidation
})

const getOneFoundReport = Joi.object({

    id:Validation.idValidation
})



export {addFoundReportSchema,
        updateFoundReport,
        deleteFoundReport,
        getOneFoundReport,
}


