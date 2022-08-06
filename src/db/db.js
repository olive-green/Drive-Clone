const mongoose =require('mongoose')
require('dotenv').config({path:'dev.env'})

const connectDB=async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGODB_URI,{
            useUnifiedTopology:true,
            useFindAndModify:true,
            useNewUrlParser:true,
            useCreateIndex:true
        })

        console.log(`Mongodb connected at ${conn.connection.host}`.cyan.bold)
    }catch(e){
        console.log('MongoDB cannot be connected : ',e)
        process.exit(1)
    }
}

module.exports=connectDB