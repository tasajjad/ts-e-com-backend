
const _ = require('lodash')
const { Category, validate } = require('../models/category')

module.exports.createCategory = async function (req, res) {
    const { error } = validate(_.pick(req.body, ["name"]))
    if (error) return res.status(400).send(error.details[0].message)

    const category = new Category(_.pick(req.body, ['name']))
    // Remove try catch block

    // try {
    const result = await category.save()

    return res.status(201).send({
        message: "Category Created Succesfully",
        data: {
            name: result.name
        }
    })

    //} catch (err) {
    // res.status(500).send(err.message)
    // }


}

module.exports.getCategories = async function (req, res) {
    const categories = await Category.find().sort({ name: 1 }).select({ _id: 1, name: 1 })
    return res.status(200).send(categories)

}