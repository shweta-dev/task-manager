const app = require('./app.js')
const port = process.env.PORT 



app.listen(port, () => {
    console.log(`Environment up at port ${port}`)
})

