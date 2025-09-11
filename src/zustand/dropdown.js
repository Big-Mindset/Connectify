import {create} from "zustand"

export let dropDown = create((set)=>({
    DropDown : null,
    setDropDown : (DropDown)=>set({DropDown}),
    reply : null ,
    setReply : (reply)=>set({reply}),
    react : null,
    setReact : (react)=>set({react}),
    Delete : null,
    setDelete  : (Delete)=>set({Delete}),

}))