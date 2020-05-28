const express = require('express')
const tasks = require('../model/tasks.js')
const route = new express.Router()
const auth = require('../midleware/auth.js')


route.post('/task', auth, async (req, res) => {
    //const task = new tasks(req.body)
    const task = new tasks( {
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    }
    catch (e) {
        res.status(400).send(e)
    }

})


route.get('/task',auth, async (req, res) => {
    try {
       const xyz ={ owner: req.user._id }
        if(req.query.completed)
        {
            xyz.completed = req.query.completed === "true"
           
        }
        
        const sort ={ }
        if(req.query.sortBy)
        {
          const part =  req.query.sortBy.split('_')   
          sort[part[0]] =  part[1] === 'desc'? -1 : 1
        }
        const tasklist = await tasks.find(xyz).limit(parseInt(req.query.limit)).skip(parseInt(req.query.skip)).sort(sort)
        res.send(tasklist)
    }
    catch (e) {
        res.status(400).send(e)
    }
})


route.get('/task/:id', auth ,async (req, res) => {
    const _id = req.params.id
    console.log('id'+ _id)
    try {
        // const task = await tasks.findById(_id)

        const task = await tasks.findOne({_id, owner: req.user._id})
        if (!task) {
            return res.status(404).send('Invalid Id passed')
        }
        res.send(task)
    }
    catch (e) {
        res.status(500).send(e)
    }
})




route.delete('/task/:id',auth, async (request, response) => {
    try {
        // const task = await tasks.findByIdAndDelete(request.params.id)
        const task = await tasks.findOneAndDelete({_id:request.params.id , owner : request.user._id})

        if (!task) {
            response.status(400).send('Invalid id send')
        }
        response.send(task)
    }
    catch (e) {
        response.status(500).send(e)
    }
})



route.patch('/task/:id',auth, async (req, resp) => {

    const inpfields = Object.keys(req.body)
    const fieldlist = ['completed', 'description']

    const validfield = inpfields.every((inp) => fieldlist.includes(inp))

    if (!validfield) {
        resp.status(400).send('You are trying to update an invalid field')
    }

    try {
        // const task = await tasks.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
       // const task = await tasks.findById(req.params.id)
       const task = await tasks.findOne({_id: req.params.id , owner: req.user._id})
        
     if (!task) {
        resp.status(400).send({ error: 'Invalid Id provided' })
    }
    inpfields.forEach(async (inp) => {
            task[inp] = req.body[inp]
            await task.save()
        })

        
        resp.send(task)
    }
    catch (e) {
        resp.status(500).send(e)
    }
})

module.exports = route