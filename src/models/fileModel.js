const mongoose =require('mongoose')

const FileSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    link:{
        type:String,
        required:true,
    },
    parentFolder:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Folder',
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    isrecycled:{
        type:Boolean,
        require:true,
        default:false
    },
    recycledDate:{
        type:Date
    }
},{
    timestamps:true
})

const File=mongoose.model('File',FileSchema)
module.exports=File