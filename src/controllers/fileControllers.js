const File = require('../models/fileModel')
const Folder = require('../models/folderModel')

const createFile = async (req, res) => {
    try {
        const { name, link, parentFolder } = req.body
        const user = req.user._id
        console.log(user)
        const folder = await Folder.findById(parentFolder)
        const prevArray = folder.childFiles
        if(prevArray.include({name: name})){
            return res.stats(401).json({
                status: false,
                message: 'file with that name already exists'
             })
        }
        else {
                // Creating File
                const file = await File.create({ name, link, parentFolder, user })
                /* Finding Parent Folder and pushing file to Child Files Array */
                const newFile = {
                    name:file.name,
                    file:file._id
                }
                const newArray = [...prevArray, newFile]
                const updatedFolder = await Folder.findByIdAndUpdate(parentFolder, { childFiles: newArray })
                console.log(updatedFolder)
            
                return res.status(201).json({
                    success: true,
                    data: file
                })
        }

    } catch (e) {
        if (e.name === 'ValidationError') {
            console.log(e)
            const messages = Object.values(e.errors).map(val => val.message)
            res.status(400).json({
                success: false,
                error: messages
            })

        } else {
            console.log(`Error occured ${e}`)
            return res.status(500).json({
                success: false,
                error: `${e}`
            })
        }
    }
}

const copyFile = async (req, res) => {
    try {
        // Need To Pass the folder Id where you want to copy your file
        const folderId = req.body.parentFolder
        const user = req.user._id
        const fileId = req.params.id
        const file = await File.findById(fileId)
        // finding folder where to copy file
        const folder = await Folder.findById(folderId)

        const prevArray = folder.childFiles
        const newFile = {
            name: file.name,
            File: file._id

        }
        const newArray = [...prevArray, newFile]
        const updatedFolder = await Folder.findByIdAndUpdate(folderId, { childFiles: newArray })
        console.log(updatedFolder)
        return res.status(201).json({
            success: true,
            data: file
        })
        

    } catch (e) {
        if (e.name === 'ValidationError') {
            console.log(e)
            const messages = Object.values(e.errors).map(val => val.message)
            res.status(400).json({
                success: false,
                error: messages
            })

        } else {
            console.log(`Error occured ${e}`)
            return res.status(500).json({
                success: false,
                error: `${e}`
            })
        }
    }
}

const moveFile = async (req, res) => {
    try {
        const fileId = req.params.id
        const folderId = req.body.parentFolder
        const file = await File.findById(fileId)
        const moveFileId = file._id
        const moveFileName = file.name
        // =======================================================================
        // Parent Folder of File
        const parentFolder = file.parentFolder
        const folder = await Folder.findById(parentFolder)
        const childFiles = folder.childFiles
        for (let i = 0; i < childFiles.length; i++){
            if (childFiles[i].File == moveFileId) {
                childFiles.splice(i, 1)
                break;
            }
        }
        // Now Update ParentFolder
        const updatedParent = await Folder.findByIdAndUpdate(parentFolder,{childFiles: childFiles})
        console.log("Parent Folder Updated" + updatedParent)
        // =====================================================================
        // Move File Logic
        // Now Move File To New Folder's Child Array
        const newFolder = await Folder.findById(folderId)
        const prevFiles = newFolder.childFiles
        const newFile = {
            name: moveFileName,
            File: moveFileId
        }
        const updatedFiles = [...prevFiles, newFile]
        // Now make an update
        const updatedFolder = await Folder.findByIdAndUpdate(folderId,{childFiles: updatedFiles})
        return res.status(201).json({
            success: true,
            data: updatedFolder
        })

    } catch (e) {
        if (e.name === 'ValidationError') {
            console.log(e)
            const messages = Object.values(e.errors).map(val => val.message)
            res.status(400).json({
                success: false,
                error: messages
            })

        } else {
            console.log(`Error occured ${e}`)
            return res.status(500).json({
                success: false,
                error: `${e}`
            })
        }
    }
}

const deleteFile = async (req, res) => {
    try {
        const fileId = req.params.id
        const parentFolder = req.body.parentFolder
        // Delete File from File Collection
        const fileData = await File.findOneAndDelete(fileId)
        // Delete From Parent Folder Child List Array
        const folder = await Folder.findById(parentFolder)
        const childFiles = folder.childFiles
        for (let i = 0; i < childFiles.length; i++){
            // In this Case Slice and Remove one element from childList array
            if (fileId == childFiles[i].File) {
                childFiles.splice(i,1)
            }
        }
        const updatedFolder = await Folder.findOneAndUpdate(parentFolder,{childFiles: childFiles})
        return res.status(201).json({
            status: true,
            data: updatedFolder
        })
    } catch (e) {
        if (e.name === 'ValidationError') {
            console.log(e)
            const messages = Object.values(e.errors).map(val => val.message)
            res.status(400).json({
                success: false,
                error: messages
            })

        } else {
            console.log(`Error occured ${e}`)
            return res.status(500).json({
                success: false,
                error: `${e}`
            })
        }
    }
}

module.exports = { createFile, copyFile, moveFile, deleteFile }