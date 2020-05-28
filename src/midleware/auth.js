const jwt = require('jsonwebtoken')
const users = require('../model/users.js')

const auth = async (req,res,next)=> {
   try{

    const token = req.header('Authorization').replace('Bearer ','')
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY)
    const user = await users.findOne({ _id :decoded.id , 'tokens.token': token})
    
    if(!user){
        throw new Error()
    }
     req.user = user
     req.token = token
    next()
   }
   catch(e){
    res.status(401).send({error: 'Please authenticate'})
   }
   
}

module.exports = auth