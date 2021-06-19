

// Basic uses of JOI validator

const Joi = require("joi");

const schema = Joi.object({
    name: Joi.string().email().required()
})

const obj = {
    name: "tasajjad20@gmail.com"
}

let data = schema.validate(obj)
