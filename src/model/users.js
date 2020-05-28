const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const task = require ('./tasks.js')

const userSchema = new mongoose.Schema ({
    name:{
        type: String,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minlength:6,
        validate(value)
        {
            if(value.toLowerCase().includes('password')){
                throw new Error('Password should not contain password string')
            }
        }
    },
    age:{
        type: Number,
        trim: true,
        default: 0,
        validate(value){
            if(value < 0){
                throw new Error('Enter positive age')
            }
        }
    },
    email: {
        type: String,
        required: true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value))
            {
                throw new Error('Invalid email entered')
            }
        },
        trim: true,
        lowercase: true
    },
    tokens:[
        {
        token:{
            type: String,
            required: true
        }
        }
    ],
    avtar:{
        type: Buffer
    }
    },
      
    {
        timestamps: true
    })

userSchema.virtual('tasks',{

    ref: 'Tasks',
    localField: '_id',
    foreignField: 'owner'
}
 )





userSchema.methods.fetchjwttoken = async function(){

  const user = this
  const token =   await jwt.sign({id: user.id.toString()},process.env.TOKEN_SECRET_KEY)
  user.tokens = user.tokens.concat({token})
 user.save()
  return token

}

userSchema.statics.findByCredentials = async (email, password) => {

    const userem = await Users.findOne({email})
    if(!userem){
        throw new Error('Invalid credentials provided')
    }
    console.log(userem)
    const pass = await bcrypt.compareSync(password, userem.password )
    if(!pass){
        console.log('pass' +pass)
        throw new Error('Invalid credentials provided')
    
    }
    return userem

}



userSchema.pre('save', async function(next)  {

    const user = this
    if(user.isModified('password')){
        const encrotpass = await bcrypt.hash(user.password, 8)
        user.password = encrotpass
    }
    next()
})

userSchema.pre('remove', async function (next){
    const user = this 
    await task.deleteMany({owner: user._id })
    next()
})

const Users = mongoose.model('Users', userSchema)

module.exports = Users