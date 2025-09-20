import {z} from "zod"

export let groupValidate = z.object({
    name : z.string().min(1,{message : "Name is required"}).max(20,{message : "So big name - only 12 characters"}),
    description : z.string().min(0).max(100,{message : "Only 100 characters"}),
})