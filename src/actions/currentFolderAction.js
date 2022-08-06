import { CURRENT_FOLDER_SET } from "../constants/currentFolderConstants"

export const setFolder=(id)=>async(dispatch)=>{
    dispatch({
        type:CURRENT_FOLDER_SET,
        payload:id
    })
}