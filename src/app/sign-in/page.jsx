"use client"
import { Inder, Roboto } from "next/font/google"
import Image from "next/image"
import properLogo from "@/assets/logop.webp"
import Link from "next/link"
import Input from "@/components/Input"
import google from "@/assets/google.svg"
import github from "@/assets/github.svg"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { signinVAlidation } from "@/zod/userSchema"
import { motion } from "framer-motion"
import { signIn } from "next-auth/react"
import toast from "react-hot-toast"
import { authStore } from "@/zustand/store"
import { ArrowRight, Loader2, Lock, LogIn, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
const inder = Inder({
    weight: ["400"],
    subsets: ["latin"],
});
const roboto = Roboto({
    weight: ["100", "200", "300", "400", "500", "600", "700"],
    subsets: ["cyrillic-ext"]
});


const login = () => {
        const [authLoading, setauthLoading] = useState("")
    
    let router = useRouter()
    let { loading, setLoading } = authStore()
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
            let res = await signIn("credentials", { ...data, redirect: false })
            console.log(res)
            if (res.url !== null && res.ok) {
                toast.success("Login successfully")
                router.push("/")

            } else {
                toast.error("Invalid Email or Password")
            }

        } catch (error) {
            console.log(error.message);

            toast.error("Network error try again")
        } finally {
            setLoading(false)
        }

    }
    let handleSignUp = async (provider) => {
        setauthLoading(provider)

        try {

            let res = await signIn(provider, { redirect: true })

        } catch (error) {
            console.log(error.message);
            toast.error("Network Error try again")

        } finally {
            setauthLoading("")

        }
    }
    return (
        <div className={` ${inder.className}  flex justify-center items-center from-slate-950 via-blue-950 to-slate-900  min-h-dvh`} >
            <motion.div

                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1, }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className=" min-h-full w-full backdrop-blur-xl shadow-black/50  border-white/10  border bg-gradient-to-bl rounded-lg max-w-lg mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10"
                >
                    <div className="bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-full px-4 py-2 flex items-center gap-2">
                        <Shield className="size-4 text-emerald-400" />
                        <span className="text-emerald-300 text-sm font-medium">Secure Authentication</span>
                    </div>
                </motion.div>
                <div className=" bg-gradient-to-r from-blue-600/20 to-indigo-600/20 p-8 text-center border-b border-white/10">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1, }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col gap-10">
                        <div className=" flex flex-col gap-4 items-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-lg"></div>
                                <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-3">
                                    <Image src={properLogo} alt="Logo" width={32} height={32} />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">

                                <h1 className="text-[1.3rem] text-center text-white">
                                    Welcome Back <span className="bg-gradient-to-r from-blue-500 font-bold to-[#00B7F9] bg-clip-text text-transparent">Connectify</span>
                                </h1>
                                <p className="text-white/70 text-[0.8rem]">Login to your previous account</p>
                            </div>
                        </div>

                    </motion.div>
                </div>

                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1, }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex justify-center gap-1 mt-7 ">
                    <p className="text-gray-100/80 flex duration-200  items-center gap-1    text-[0.9rem]">Don,t have an Account?<Link className="text-blue-400 flex hover:underline hover:text-sky-300 gap-1 items-center " href={"/sign-up"}>
                        <span>Sign in</span>
                        <ArrowRight className="text-shadow-sky-400 size-2.5" />
                    </Link>
                    </p>

                </motion.div>
                <div className="w-full mx-auto  px-8 py-3 ">
                    <motion.form
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1, }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        onSubmit={handleSubmit(handleForm)}
                        className={`mt-4 flex  ${roboto.className} flex-col gap-4`}
                    >

                        <Input label="Email" id="email" placeholder="Enter your email" type="email" register={register} errors={errors} />
                        <Input label="Password" id="password" placeholder="Enter your password" type="password" register={register} errors={errors} />
                        <motion.button
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1, }}
                            transition={{ duration: 0.5, delay: 0.6 }}

                            disabled={loading} type="submit" className="cursor-pointer flex gap-1 items-center justify-center  text-white  bg-gradient-to-r from-blue-500/80 to-indigo-500/70 rounded-md hover:bg-gradient-to-r transition-colors  outline-none duration-300 hover:from-indigo-700/80 hover:to-blue-500/80   focus:ring-1 focus:ring-white px-3.5 py-3  " >
                            {loading ? <Loader2 className="animate-spin ease-in-out  mx-auto" /> : <>
                                Login
                                <LogIn />
                            </>
                            }

                        </motion.button>
                    </motion.form>
                    <div className="border-t-[0.7px]  relative border-gray-700/60 my-10">
                        <div className="bg-gray-900/50 backdrop-blur-sm text-white/80 text-[0.9rem] px-2 absolute rounded-full  left-1/2   -translate-1/2  ">
                            Or continue with
                        </div>
                    </div>
                    <motion.div

                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1, }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                        className="grid grid-cols-2 gap-4">

                        <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSignUp("google")}
                            disabled={authLoading === "google"}
                            className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-4 transition-all duration-200 backdrop-blur-sm hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {authLoading === "google" ? (
                                <Loader2 className="size-6 animate-spin text-white/70 mx-auto" />
                            ) : (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-red-500/20 rounded-full blur-sm group-hover:blur-md transition-all"></div>
                                        <Image
                                            src={google}
                                            alt="Google"
                                            width={24}
                                            height={24}
                                            className="relative"
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-white/80 group-hover:text-white">
                                        Google
                                    </span>
                                </div>
                            )}
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSignUp("github")}
                            disabled={authLoading === "github"}
                            className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-4 transition-all duration-200 backdrop-blur-sm hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {authLoading === "github" ? (
                                <Loader2 className="size-6 animate-spin text-white/70 mx-auto" />
                            ) : (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gray-400/20 rounded-full blur-sm group-hover:blur-md transition-all"></div>
                                        <Image
                                            src={github}
                                            alt="Github"
                                            width={24}
                                            height={24}
                                            className="relative filter brightness-0 invert"
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-white/80 group-hover:text-white">
                                        GitHub
                                    </span>
                                </div>
                            )}
                        </motion.button>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg"
                    >
                        <div className="flex items-center gap-3">
                            <Lock className="size-5 text-emerald-400 flex-shrink-0" />
                            <div>
                                <p className="text-emerald-300 text-sm font-medium">Secure & Private</p>
                                <p className="text-emerald-200/70 text-xs mt-1">
                                    Your data is encrypted and protected .
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div >
    )
}
export default login