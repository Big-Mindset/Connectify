"use client"

import images from "@/image"
import { Button } from "@/components/ui/button"
import { Inder, Roboto } from "next/font/google"
import Image from "next/image"
import Link from "next/link"
import react from "react"
import Input from "@/components/Input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { signinVAlidation } from "@/zod/userSchema"
import { motion } from "framer-motion"
import {signIn } from "next-auth/react"
import toast from "react-hot-toast"
import { authStore } from "@/zustand/store"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
const inder = Inder({
    weight: ["400"],
    subsets: ["latin"],
});
const roboto = Roboto({
    weight: ["100", "200", "300", "400", "500", "600", "700"],
    subsets: ["cyrillic-ext"]
});


const login = () => {
    let router = useRouter()
    let {loading , setLoading} = authStore()
    let { handleSubmit, formState: { errors }, register } = useForm({
        resolver: zodResolver(signinVAlidation),
        defaultValues: {
            email: "",
            password: ""
        }
    })
    
    let handleForm = async (data) => {
            setLoading(true)
        try {
            let res = await signIn("credentials",{...data,redirect : false})
            
            if (res.ok){
                toast.success("Login successfully")
                router.push("/Chat-app")

            }else{
                toast.error(res.error)
            }
            
        } catch (error) {
            console.log(error.message);
            
            toast.error("Network error try again")
        }finally{
            setLoading(false)
        }

    }
    return (
        <div className={` ${inder.className}  min-h-[calc(100vh-10rem)]`} >
            <div className=" min-h-full w-full    rounded-md grid grid-cols-2 bg-gradient-to-bl  from-[#0600C0]/83 to-[#111416]/88 max-w-[1455px] mx-auto">
                <div className="flex flex-col ml-9 gap-10 p-2">

                    <div className=" flex flex-col gap-2 items-center">

                        <div className="flex gap-2 justify-center items-center">

                            <Image src={images.properLogo} alt="Logo" width={40} />
                            <p className="text-[2rem] text-white">Chat</p>
                        </div>

                        <h1 className="text-[3rem] text-center text-white">
                            Welcome back to  <span className="text-[#00B7F9]">Connectify</span>
                        </h1>

                    </div>
                    <div className="w-full mx-auto max-w-[500px] p-4 mt-16">
                        <h1 className="text-xl  text-white">Login to your Account</h1>
                        <div className="flex flex-col gap-5 ">
                            <motion.hr
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: 210, opacity: 1 }}
                                transition={{ duration: 0.5, ease: "easeIn" }}
                                className="w-[50%] mr-2 border-[#0095FF] border-2" />
                            <p className="text-gray-300 font-medium">Don,t have an Account?<Link className="text-blue-400 hover:underline" href={"/sign-up"}>Sign-up</Link></p>
                        </div>
                        <form
                            onSubmit={handleSubmit(handleForm)}
                            className={`mt-4 flex  ${roboto.className} flex-col gap-4`}
                        >

                            <Input label="Email" id="email" placeholder="Enter your email" type="email" register={register} errors={errors} />
                            <Input label="Password" id="password" placeholder="Enter your password" type="password" register={register} errors={errors} />
                            <button disabled={loading} type="submit"  className="cursor-pointer text-white bg-[#0697FF] rounded-md hover:bg-[#068fff] duration-100 focus:ring-1 focus:ring-white px-3.5 py-2  " >
                            {loading ? <Loader2 className="animate-spin ease-in-out mx-auto" /> : "Login"} 

                            </button>
                        </form>

                    </div>
                </div>

                <div >
                    <Image src={images.AuthenticationImage} className="w-full justify-self-end max-w-[80%] h-[99.4%]" alt="Authentication" />
                </div>
            </div>
        </div>
    )
}
export default login