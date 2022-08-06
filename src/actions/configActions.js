import { CONFIG_REQUEST, CONFIG_RESET } from "../constants/configConstants"

export const setconfig=(token)=>async(dispatch)=>{
    dispatch({
        type:CONFIG_REQUEST,
        payload:token
    })
}

export const resetConfig=()=>async(dispatch)=>{
    dispatch({type:CONFIG_RESET})
}