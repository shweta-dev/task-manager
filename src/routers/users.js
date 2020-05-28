const express = require('express')
const users = require('../model/users.js')
const route = new express.Router()
const auth = require('../midleware/auth.js')
const multer = require('multer')
const { sendWelcomeEmail, sendCancelationEmail } = require('../email/account')

const upload = multer({
   // dest : 'avtar'
})

route.post('/user/login', async(req,res) => {

     try{
        const user =  await users.findByCredentials(req.body.email, req.body.password)
        const token = await user.fetchjwttoken()
         res.send({user, token})
     }
     catch(e){
        res.status(400).send(e)
    }
})


route.post('/user/logout',auth, async(req,res) => {
   
    try{
    req.user.tokens =  req.user.tokens.filter((token) => {
           return  token.token !== req.token
    })

    await req.user.save()
    res.send('User logged out sucessfully')
}
catch(e){
    res.status(500).send('logout failed!')
}
})


route.post('/user/logoutAll', auth, async (req,res) => 
{
    try{

        req.user.tokens = []
        await req.user.save()
        res.send('Logout from all sessions succesful')
    }
    catch(e){
        res.status(500).send('Logout failed')
    }

}

)

route.get('/user/me',auth, async (req, res) => {
     
    // try{
    //     const userlist = await users.find({})
    //     res.status(201).send(userlist)
    // }
    // catch(e){
    //     res.status(400).send(e)
    // }
    res.send(req.user)
    
})



// route.get('/user/:id', async (req, res) => {
//     const _id = req.params.id
//     try {
//         const user = await users.findById(_id)
//         if (!user) {
//             return res.status(404).send('Invalid Id passed')
//            }
//            res.send(user)
//     }
//     catch (e) {
//         res.status(500).send(e)

//     }
// })

route.post('/user', async (req, res) => {
    const user =  new users(req.body)
    try
    {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
       const token = await user.fetchjwttoken()
       res.status(201).send({user,token})
    }
    catch(e)
    {
        res.status(400).send(e)
    }
})


route.patch('/user/me',auth, async (request, response) => {
    
    const input = Object.keys(request.body)
    const fields = ['name', 'age' , 'email', 'password']

    const validinp = input.every((inp) => fields.includes(inp))
    console.log(validinp)
    if(!validinp)
    {
        return response.status(400).send({error: 'You are trying to update an invalid field'})
    }

    try{
    //const user = await users.findByIdAndUpdate(request.params.id , request.body, {new : true ,runValidators: true})
    //const user = await users.findById(request.params.id)
    input.forEach((inp) =>  request.user[inp] = request.body[inp])
    await request.user.save()    
    response.send(request.user)
} 
catch(e){
    response.status(500).send(e)
}
})


route.delete('/user/me', auth, async(request, response) => {
    try{
//    const user = await users.findByIdAndDelete(request.user._id)
//    if(!user)
//    {
//        response.status(400).send('Invalid id send')
//    }
    await request.user.remove()
    sendCancelationEmail(request.user.email, request.user.name)
   response.send(request.user)
}
catch(e){
    response.status(500).send(e)
}
})


route.post('/users/me/avtar',auth,upload.single('avtar'), async (req, res) => {

    req.user.avtar = req.file.buffer
    await req.user.save()
    res.send('avtar uploaded')
})


module.exports = route