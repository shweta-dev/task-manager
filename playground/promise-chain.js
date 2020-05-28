require('../src/db/mongoose.js')
const User = require('../src/model/users.js')


// User.findOneAndUpdate(
//     {_id: "5ec50643ab1b054a8e2ec24a"},{"age" : 28}
//      ).then((result) => {
//     return User.countDocuments({ age: 28 })
// }).then((res) => {
//     console.log(res)
// }).catch((e) => {
//  console.log(e)
// }
// )

const countdscrb = async(id, age) => {
    const update = await User.findOneAndUpdate(id,{age})
    const count = await User.countDocuments({ age })
     return count
}

countdscrb("5ec50643ab1b054a8e2ec24a", 11).then((count) => {
    console.log('count' +count)
}).catch((e) => {
    console.log('e' +e)
})