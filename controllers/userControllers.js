const bcrypt = require('bcrypt')
const _ = require('lodash')
const { User, validate } = require('../models/user')


// SignUp Method
module.exports.signUp = async (req, res) => {

    const { error } = validate(req.body)
    // console.log('ERROR'.error)
    if (error) return res.status(400).send(error.details[0].message)

    let user = await User.findOne({ email: req.body.email })
    // console.log("USER:", user)
    if (user) return res.status(400).send("User Already Registered")
    user = new User(_.pick(req.body, ['name', 'email', 'password']))
    let salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)

    let token = user.generateJWT()
    // console.log("User ", user)



    const result = await user.save()
    return res.status(201).send({
        message: "Registration Succesfull",
        "token": token,
        user: _.pick(result, ['_id', 'email', 'name'])
    })


}

// Simple SignIn Method 

module.exports.signIn = async (req, res) => {

    // console.log(req.body.email)
    let user = await User.findOne({ email: req.body.email })

    if (!user) return res.status(400).send("Invalid email or password")

    const validUser = await bcrypt.compare(req.body.password, user.password)
    if (!validUser) return res.status(400).send("Invalid email password")

    const token = user.generateJWT()
    return res.status(200).send({
        message: "Login Succesfully",
        token: token,
        user: _.pick(user, ['_id', 'email', 'name'])

    })

}