import {create} from "zustand"
import { authStore } from "./store";

export let typingStore = create((set)=>({
    isTyping : false,
    handleTyping : (data)=>{
        
        let selectedInfo = authStore.getState().selectedInfo.id
        if (selectedInfo !== data.chatId) return
        set({isTyping : data.typing})
    }
}))