const mongoose =require('mongoose')

const FolderSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    parentFolder: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Folder',
    },
    childFolder:[
        {
            name:{
                type:String,
                required:true
            },
            folder:{
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Folder',
            },
            isrecycled:{
                type:Boolean,
                require:true,
                default:false
            },
            recycledDate:{
                type:Date
            }
        }
    ],
    childFiles:[
        {
            name:{
                type:String,
                required:true
            },
            file:{
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'File',
            },
            link:{
                type:String,
                required:true
            },
            isrecycled:{
                type:Boolean,
                require:true,
                default:false
            },
            recycledDate:{
                type:Date
            }
        }
    ],
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

const Folder=mongoose.model('Folder',FolderSchema)
module.exports=Folder