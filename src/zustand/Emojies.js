import {create} from "zustand"

export let Emjies = create((set)=>({
    emojies : null,
    setemojies : (emojies)=>set({emojies}),
    Emojies : null,
    setEmojies : (Emojies)=>set({Emojies}),
}))