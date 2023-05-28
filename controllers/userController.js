const User = require('../models/Users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const {loginValidate, registerValidate} = require('./validate')

const userController = {
    register: async function register(req, res){

        const {error} = registerValidate(req.body)

        if(error){
            return res.status(400).send(error.message)
        }

        const selectedUser = await User.findOne({email: req.body.email})

        if(selectedUser){
            return res.status(400).send('email já existente')
        }

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password) 
        })

        try{
            const savedUser = await user.save()
            res.send(savedUser)
        }catch(err){
            res.status(400).send(err)
        }
    },
    login: async function login(req, res){

        const {error} = loginValidate(req.body)

        if(error){
            return res.status(400).send(error.message)
        }


        const selectedUser = await User.findOne({email: req.body.email })

        if(!selectedUser){
            return res.status(400).send("Email ou Senha incorreta")
        }

        const passwordAndUserMatch = bcrypt.compareSync(req.body.password, selectedUser.password)

        if(!passwordAndUserMatch){
            return res.status(400).send("Email ou Senha incorreta")
        }

        const token = jwt.sign({_id: selectedUser._id, admin:selectedUser.admin}, process.env.TOKEN_SECRET )
        res.header("authorization-token", token)
        res.send("usuário ligado ...")

    }
}




module.exports= userController