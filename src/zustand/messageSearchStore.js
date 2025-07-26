import { createSelectors } from "@/lib/Selector";
import {create} from "zustand"

export let messageStore = create((set)=>({
    searchMessages : "",
    setSearchMessages : (searchMessages)=>set({searchMessages}),
    searchResult : [],
    setSearchResult : (objectMessage)=>set({searchResult :objectMessage }),

    category : "All",
    setCategory : (category)=>set({category}),
}))
export const messagestore = createSelectors(messageStore);
