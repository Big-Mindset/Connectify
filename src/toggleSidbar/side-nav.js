import { create } from "zustand";

export let toggleSidebar = create((set,get)=>({
    toggle : false,
    setToggle : (toggle)=>set({toggle})
}))