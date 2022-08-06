import { CURRENT_FOLDER_SET} from "../constants/currentFolderConstants"

export const currentFolderReducer=(state={},action)=>{
    switch (action.type){
        case CURRENT_FOLDER_SET:
            return {currentFolder:action.payload}
        default:
            return state
    }
}