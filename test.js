

// Basic uses of JOI validator

// const Joi = require("joi");

// const schema = Joi.object({
//     name: Joi.string().email().required()
// })

// const obj = {
//     name: "tasajjad20@gmail.com"
// }

// let data = schema.validate(obj)


const body = {
    order: [12213, 3123123],
    sortBy: 'price',
    limit: 6,
    skip: 0,
    filters: {
        price: [1000, 1333],
        category: ['67HJNKHGnkbfubenflsdfioeh', '74msdnfhiuehfihfui']
    }
}

// console.log(body)
const test = "order";


// body['test'] = "SAJJAD AHJMED"

// console.log(body)

console.log(body.order[0])