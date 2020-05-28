const request = require('supertest')
const app = require('../src/app')
const User = require('../src/model/users')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const userId = new mongoose.Types.ObjectId()
const testUser = {
    _id: userId,
    name: "Mike",
    password:"Mike12345",
    email:"mike@xyz.com",
    tokens:[
        {
            token: jwt.sign({id: userId}, process.env.TOKEN_SECRET_KEY)
            
        }
    ]
        
    
}


beforeEach(async () => {
   await User.deleteMany()
   await User(testUser).save()
})


test('Should create user', async() => {

   const response = await request(app).post('/user').send({
        name:"Shweta",
        password:"Shweta@12",
        email:"shweta@gmail.com"
    }).expect(201)

    // check if record is created in database
    const user = User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user: {
            name: 'Shweta',
            email:'shweta@gmail.com'
        }
        })
} ) 

test('Should login into account', async() => {

    await request(app).post('/user/login').send({
        email: testUser.email ,
        password: testUser.password

    }).expect(200)
})

test('Invalid credential login into account should fail', async() => {

    await request(app).post('/user/login').send({
        email: testUser.email ,
        password: "inalidpass"

    }).expect(400)
})


test('fetch user detail', async() => {
    await request(app)
        .get('/user/me')
        .set('Authorization',`Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200)

})

test('should not fetch user detail if not authenticated', async() => {
    await request(app)
        .get('/user/me')
        .send()
        .expect(401)

})

test('Fail user delete on Auth fail', async() => {
    await request(app)
        .delete('/user/me')
        .send()
        .expect(401)

})

test('Delete user after auth', async() => {
    await request(app)
        .delete('/user/me')
        .set('Authorization',`Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200)

})