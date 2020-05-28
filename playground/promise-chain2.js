require('../src/db/mongoose.js')
const Task = require('../src/model/tasks.js')


// Task.findByIdAndDelete( "5ec4fd80f4dd4949e43e3d46").then((result) => {
//     console.log(result)
//     return Task.countDocuments({completed : false})
// }).then(( res) => {
//     console.log(res)
// }).catch((e) => {
//     console.log(e)
// })


const countinIncompleted = async (id) => {
    const delTask = await Task.findByIdAndDelete(id)
    const incomcount = await Task.countDocuments({completed : false})
    return incomcount
}

countinIncompleted(('5ec4ff5607d42d49f5a19ff3')).then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})