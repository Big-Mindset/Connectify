import {z} from "zod"

export let signupValidations = z.object({
    name : z.string().min(5,{message : "Username must contain atleast 5 characters"}).max(20,{message : "Username must be less than 20 characters"}).regex(/^[A-Za-z0-9 ]+$/,{message : "No special characters"}),
    email : z.string().min(1,{message : "Email is required"}).email(),
    password : z.string().min(6,{message : "Password must contain atleat 6 characters"}).max(18,{message : "password must be less than 18 characters"}).regex(/^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,{message : "Must include a special character, lowercase letter, and number"})
})

export let signinVAlidation = z.object({
    email : z.string().min(1,{message : "Email is required"}).email(),
    password : z.string().min(1,{message : "Password is required"})
})