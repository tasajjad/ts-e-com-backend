const _ = require('lodash')
const { CartItem } = require('../models/cartItem')

module.exports.createCartItem = async function (req, res) {
    let { price, product } = _.pick(req.body, ['price', 'product'])
    const item = await CartItem.findOne({
        user: req.user,
        product: product
    })
    if (item) {
        return res.status(400).send('Item already exists in Cart')
    } else {
        let cartItem = new CartItem({ price: price, product: product, user: req.user._id })
        const result = await cartItem.save()
        res.status(201).send({
            message: "Add to Cart successfully",
            data: result
        })
    }
}
//There is Used in Populate or reference or one to one or one two many reletionship
module.exports.getCartItem = async function (req, res) {
    const cartItems = await CartItem.find({ user: req.user.id })
        .populate('product', 'name')
        .populate('user', 'name')

    return res.status(200).send(cartItems)

}
module.exports.updateCartItem = async function (req, res) {
    const { _id, count } = _.pick(req.body, ['count', '_id'])
    let userId = req.user.id
    await CartItem.updateOne({ _id: _id, user: userId }, { count: count })

    return res.status(200).send("Item updated successfully")

}

module.exports.deleteCartItem = async function (req, res) {
    const _id = req.params.id
    let userId = req.user._id
    await CartItem.deleteOne({ _id: _id, user: userId })
    res.status(200).send("Deleted")

}