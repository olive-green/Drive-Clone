import { CONFIG_REQUEST, CONFIG_RESET } from "../constants/configConstants"


export const configReducer=(state={},action)=>{
    switch (action.type){
        case CONFIG_REQUEST:
            return {token:action.payload}
        
        case CONFIG_RESET:
            return {token:''}

        default:
            return state
    }
}