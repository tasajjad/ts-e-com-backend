const _ = require('lodash')
const formidable = require('formidable')
const fs = require('fs')
const { Product, validate } = require('../models/products')
const { parseInt } = require('lodash')

module.exports.createProduct = async function (req, res) {
    let form = new formidable.IncomingForm()
    form.keepExtension = true
    form.parse(req, (err, fields, files) => {
        if (err) return res.status(400).send("Something went wrong")
        const { error } = validate(_.pick(fields, ["name", "description", "price", "category", "quantity"]))
        if (error) return res.status(400).send(error.details[0].message)
        const product = new Product(_.pick(fields, ["name", "description", "price", "category", "quantity"]))
        if (files.photo) {
            // <input type="file" name="photo"/>
            fs.readFile(files.photo.path, (err, data) => {

                if (err) return res.status(400).send("Problem in file Data")
                product.photo.data = data;
                product.photo.contentType = files.photo.type;
                product.save((err, result) => {
                    if (err) return res.status(500).send("Internal Server Error")
                    else res.status(201).send({
                        message: "Product Created Succesfully",
                        data: _.pick(result, ["name", "description", "price", "category", "quantity"])
                    })
                });
            })
        } else {
            return res.status(400).send("No image Provided")
        }
    })



}

// Queey String

// api/product?order=desc&sortBy=name&limit=10

module.exports.getProduct = async function (req, res) {

    let order = req.query.order === 'desc' ? -1 : 1;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const products = await Product.find().
        select({ photo: 0, description: 0 })
        .sort({ [sortBy]: order })
        .limit(limit)
        .populate('category', 'name')
    return res.status(200).send(products)

}

module.exports.getProductById = async function (req, res) {
    const productId = req.params.id;
    const product = await Product.findById(productId).select({ photo: 0 }).populate('category', 'name')
    if (!product) return res.status(404).send("Not Found")
    return res.status(200).send(product)

}

module.exports.getPhoto = async function (req, res) {
    const productId = req.params.id
    const product = await Product.findById(productId).select({ photo: 1, _id: 0 })
    res.set('Content-Type', product.photo.contentType)
    res.status(200).send(product.photo.data)
}
module.exports.updateProductById = async function (req, res) {
    const productId = req.params.id
    const product = await Product.findById(productId)
    let form = new formidable.IncomingForm()
    form.keepExtension = true;

    form.parse(req, (err, fields, files) => {
        if (err) return res.status(400).send("Something went  Wrong ")


        const updatedFiled = _.pick(fields, ['name', 'description', 'price', 'category', 'quantity'])
        _.assignIn(product, updatedFiled);
        if (files.photo) {
            fs.readFile(files.photo.path, (err, data) => {
                if (err) return res.status(400).send("Something Wrong")
                product.photo.data = data;
                product.photo.contentType = files.photo.type;
                product.save((err, result) => {
                    if (err) return res.status(500).send("Internal Server Error 1")


                    else return res.status(201).send("Product Updated Succesfully")
                });
            })
        } else {
            product.save((err, result) => {
                if (err) return res.status(500).send("Internal Server Error")
                else return res.status(201).send("Product Updated Succesfully")
            });
        }
    })


}

const body = {
    order: 'desc',
    sortBy: 'price',
    limit: 6,
    skip: 0,
    filters: {
        price: [1000, 1333],
        category: ['67HJNKHGnkbfubenflsdfioeh', '74msdnfhiuehfihfui']
    }
}

module.exports.filterProducts = async function (req, res) {

    let order = req.body.order === 'desc' ? -1 : 1;
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = parseInt(req.body.skip);
    let filters = req.body.filters;
    let args = {}

    for (let key in filters) {
        if (filters[key].length > 0) {
            if (key === 'price') {
                // {price:{$gte:0,$lte:1000}}
                //{ price: { '$gte': 1000, '$lte': 1333 } } print 

                args['price'] = {
                    $gte: filters['price'][0],
                    $lte: filters['price'][1]// filters.price[1]

                }
                // console.log(args)
            }

            if (key === 'category') {
                // {category:{$in:[23ngnerjiotjoerjt,o9hre94u35ojmdflmr]}}
                args.category = {
                    $in: filters['category'] // filters.category
                }
                // console.log(args)
            }
        }
    }

    const products = await Product.find(args)
        .select({ photo: 0 })
        .populate('category', 'name')
        .sort({ [sortBy]: order })
        .skip(skip)
        .limit(limit)

    res.status(200).send(products)

}