"use client"

import properLogo from  "@/assets/logop.webp"
import AuthenticationImage from  "@/assets/authentication.png"
import google from "@/assets/google.svg"
import github from "@/assets/github.svg"
import { Inder, Roboto } from "next/font/google"
import Image from "next/image"
import Link from "next/link"
import  { useState } from "react"
import Input from "@/components/Input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { signupValidations } from "@/zod/userSchema"
import { motion } from "framer-motion"
import { authStore } from "@/zustand/store"
import axios from "axios"
import { Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
const inder = Inder({
    weight: ["400"],
    subsets: ["latin"],
});
const roboto = Roboto({
    weight: ["100", "200", "300", "400", "500", "600", "700"],
    subsets: ["cyrillic-ext"]
});


const signUp = () => {
    let {loading , setLoading} = authStore()
    let router = useRouter()
    // Use-From
    let { handleSubmit, formState: { errors }, register } = useForm({
        resolver: zodResolver(signupValidations),
        defaultValues: {
            email: "",
            name: "",
            password: ""
        }
    })
    const [authLoading, setauthLoading] = useState("")

    // Form Submission
    let handleForm = async (data) => {
        try {
            setLoading(true)
            let res = await axios.post("/api/sign-up",data)
            
            if (res.status === 201){
                toast.success(res?.data?.message)
                router.push("/sign-in")
            }else{
                toast.error(res?.data?.message)
            }
        } catch (error) {
            if (error.response.status === 409){
                toast.error(error.response?.data?.message)
            }else if (error.response.status === 400){
                toast.error(error.response?.data?.message)
            }else {
                toast.error(error?.response?.data?.message || "Check your network Connection")
            }     
        }finally{
            setLoading(false)

        }
    }

    // Google and Github SignUp

    let handleSignUp = async (provider)=>{
        setauthLoading(provider)

        try {
            
            let res = await signIn(provider,{redirect : true})
            
        } catch (error) {
            console.log(error.message);
            toast.error("Network Error try again")
            
        }finally{
            setauthLoading("")

        }
    }

    
    return (
        <div className={` ${inder.className}  h-[calc(100vh-10rem)]`} >
            <div className=" min-h-full w-full rounded-md grid grid-cols-2 bg-gradient-to-bl  from-[#0600C0]/83 to-[#111416]/88 max-w-[1455px] mx-auto">
                <div className="flex flex-col  ml-9 p-2.5  gap-10">

                    <div className=" flex flex-col gap-2 items-center">

                        <div className="flex gap-2 justify-center items-center">

                            <Image src={properLogo} alt="Logo" width={40} />
                            <p className="text-[2rem] text-white">Chat</p>
                        </div>

                        <h1 className="text-[3rem] text-center text-white">
                            Welcome to  <span className="text-[#00B7F9]">Connectify</span>
                        </h1>

                    </div>
                    <div className="w-full mx-auto max-w-[500px] p-4 ">
                        <h1 className="text-xl  text-white">Create a new Account</h1>
                        <div className="flex flex-col gap-5 ">
                            <motion.hr
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: 210, opacity: 1 }}
                                transition={{ duration: 0.5, ease: "easeIn" }}
                                className="w-[50%] mr-2 border-[#0095FF] border-2" />
                            <p className="text-gray-300 font-medium">Already have an Account?<Link className="text-blue-400 hover:underline" href={"/sign-in"}>Sign-in</Link></p>
                        </div>
                        <form
                            onSubmit={handleSubmit(handleForm)}
                            className={`mt-4 flex  ${roboto.className} flex-col gap-6`}
                        >
                            <Input label="Name" id="name" placeholder="Enter your name" type="text" register={register}  errors={errors} />
                            <Input label="Email" id="email" placeholder="Enter your email" type="email" register={register} errors={errors}  />
                            <Input label="Password" id="password" placeholder="Enter your password" type="password" register={register} errors={errors}  />
                            <button
                                disabled={loading}
                             type="submit" 
                             variant="secondary" 
                             className="cursor-pointer text-white bg-[#0697FF] rounded-md hover:bg-[#068fff] duration-100 focus:ring-1 focus:ring-white px-3.5 py-2  " >
                             
                               {loading ? <Loader2 className="animate-spin ease-in-out mx-auto" /> : "Sign up"} 
                            </button>
                        </form>
                        <p className="text-center mb-6 mt-3 text-[1.2rem] text-white">or</p>

                        <div className="flex justify-center gap-4 mt-6">
                            <button  onClick={()=>handleSignUp("google")} className="px-4 py-3 w-full flex items-center justify-center gap-2 hover:bg-white/10 active:bg-white/5 transition-all duration-150 ease-out cursor-pointer border border-white/30 rounded-lg group backdrop-blur-sm">
                            {authLoading === "google" ? 
                            <Loader2 className="animate-spin opacity-65 text-white"/> 
                            :
                            <Image
                            src={google}
                            alt="Google"
                                    width={24}
                                    height={24}
                                    className="filter brightness-0 invert group-hover:brightness-100 group-hover:invert-1 transition-all"
                                    />
                                }
                                <span className="text-base font-semibold text-white/90 group-hover:text-white">
                                    Google
                                </span>
                            </button>
                            <button onClick={()=>handleSignUp("github")} className="px-4 py-3 w-full flex items-center justify-center gap-2 hover:bg-white/10 active:bg-white/5 transition-all duration-150 ease-out cursor-pointer border border-white/30 rounded-lg group backdrop-blur-sm">
                                {authLoading === "github" ? 
                            <Loader2 className="animate-spin text-white opacity-65"/> 
                            :
                                <Image
                                src={github}
                                alt="Github"
                                width={24}
                                height={24}
                                className="filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all"
                                />
                            }
                                <span className="text-base font-semibold text-white/90 group-hover:text-white">
                                    Github
                                </span>
                            </button>
                        </div>

                    </div>
                </div>

                <div>
                    <Image src={AuthenticationImage} className="w-full justify-self-end max-w-[80%] h-[99.4%]" alt="Authentication" />
                </div>
            </div>
        </div>
    )
}
export default signUp