import Joi from'joi';
import * as Validation from '../../utils/globalJoiFields.js';



const addMissingReportSchema = Joi.object({
    firstReporterName:Validation.nameValidation.required(),
    lastReporterName:Validation.nameValidation.required(),
    phoneNumber:Validation.phoneNumberValidation.required(),
    nationalID:Validation.nationalIDValidation.required(),
    governorate:Validation.governorateValidation.required(),
    date:Validation.dateValidation.required(),
})

const updateMissimgReport = Joi.object({

    firstReporterName:Validation.nameValidation,
    lastReporterName:Validation.nameValidation,
    phoneNumber:Validation.phoneNumberValidation,
    nationalID:Validation.nationalIDValidation,
    governorate:Validation.governorateValidation,
    date:Validation.dateValidation,
    id:Validation.idValidation
})


const deleteMissingReport = Joi.object({

    id:Validation.idValidation
})

const getOneMissingReport = Joi.object({

    id:Validation.idValidation
})



export {addMissingReportSchema,
        updateMissimgReport,
        deleteMissingReport,
        getOneMissingReport,
}



