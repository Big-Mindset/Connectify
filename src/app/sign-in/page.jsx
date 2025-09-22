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
import { getSession, signIn } from "next-auth/react"
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
            if (res.url !== null && res.ok) {
                toast.success("Login successfully")
                router.push("/")

            } else {
                toast.error("Invalid Email or Password")
            }

        } catch (error) {

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
            toast.error("Network Error try again")

        } finally {
            setauthLoading("")

        }
    }
    return (
        <div className={` ${inder.className}  flex justify-center items-center dark:bg-gradient-to-r bg-gray-200 dark:from-slate-950 dark:via-blue-950  dark:to-slate-900  min-h-dvh`}>
        <div className="relative w-full">
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="dark:bg-emerald-500/20 absolute -top-6 z-20 left-1/2 -translate-x-1/2 backdrop-blur-2xl  border bg-white border-emerald-400/30 rounded-full px-4 py-2 flex items-center gap-2">
                <Shield className="size-4 text-emerald-400" />
                <span className="text-emerald-300 text-sm font-medium">Secure Authentication</span>
            </motion.div>
    
            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1, }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className=" min-h-full w-full shadow-black/30 backdrop-blur-2xl shadow-md  overflow-hidden dark:border-0   border-white/10  border bg-gradient-to-bl rounded-lg max-w-lg mx-auto">
    
                <div className=" dark:bg-gradient-to-r dark:bg-blue-500/60 bg-blue-500  p-8 text-center border-b border-white/10">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1, }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col gap-10">
                        <div className=" flex flex-col gap-4 items-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blu dark:bg-blue-500/30 rounded-full blur-lg"></div>
                                <div className="relative dark:bg-white/10 bg-white backdrop-blur-sm border border-white/20 rounded-full p-3">
                                    <Image src={properLogo} alt="Logo" width={32} height={32} />
                                </div>
                            </div>
    
                            <div className="flex flex-col gap-1.5">
                                <h1 className="text-[1.3rem] text-center text-white">
                                    Welcome Back <span className="text-transparent bg-clip-text bg-gradient-to-r text-[1.5rem] from-blue-400 to-cyan-400">Connectify</span>
                                </h1>
                                <p className="dark:text-white/70 text-white/50 text-[0.8rem]">Login to your previous account</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
    
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1, }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="flex justify-center gap-1 mt-7 ">
                    <p className="dark:text-gray-100/80 text-black/80 flex duration-200  items-center gap-1    text-[0.9rem]">Don,t have an Account?<Link className="text-blue-400 flex hover:underline hover:text-sky-300 gap-1 items-center " href={"/sign-up"}>
                        <span>Sign in</span>
                        <ArrowRight className="text-shadow-sky-400 size-2.5" />
                    </Link>
                    </p>
                </motion.div>
    
                <div className="w-full mx-auto  px-8 py-3 ">
                    <motion.form
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1, }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        onSubmit={handleSubmit(handleForm)}
                        className={`mt-4 flex  ${roboto.className} flex-col gap-4`}>
                        <Input label="Email" id="email" placeholder="Enter your email" type="email" register={register} errors={errors} />
                        <Input label="Password" id="password" placeholder="Enter your password" type="password" register={register} errors={errors} />
    
                        <motion.button
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1, }}
                            transition={{ duration: 0.4, delay: 0.6 }}
                            disabled={loading} type="submit" className="cursor-pointer hover:scale-[1.03] focus-within:scale-[1] hover:shadow-md hover:shadow-blue-500/70 flex gap-1 items-center justify-center  text-white  bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-800 disabled:to-indigo-800 rounded-md hover:bg-gradient-to-r transition-all  outline-none duration-500  focus:ring-1 focus:ring-white px-3.5 py-3  ">
                            {loading ? <Loader2 className="animate-spin ease-in-out  mx-auto" /> : <>
                                Login
                                <LogIn />
                            </>
                            }
                        </motion.button>
                    </motion.form>
    
                    <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{ duration: 0.4, delay: 0.7 }}
                        className="border-t-[0.7px]  relative border-gray-700/60 my-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.8 }}
                            className="bg-gray-900/50 backdrop-blur-sm text-white/80 text-[0.9rem] px-2 absolute rounded-full  left-1/2 -translate-x-1/2 -translate-y-1/2">
                            Or continue with
                        </motion.div>
                    </motion.div>
    
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1, }}
                        transition={{ duration: 0.5, delay: 0.9 }}
                        className="grid grid-cols-2 gap-4">
    
                        <motion.button
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.4, delay: 1.0 }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSignUp("google")}
                            disabled={authLoading === "google"}
                            className="group relative bg-white/5 hover:bg-white/10 border dark:border-white/10 dark:hover:border-white/20 rounded-xl p-4 transition-all border-gray-300  duration-200 backdrop-blur-sm dark:hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                            {authLoading === "google" ? (
                                <Loader2 className="size-6 animate-spin text-blue-500 dark:text-white/70 mx-auto" />
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
                                    <span className="text-sm font-medium  text-black/90 dark:text-white/80 dark:group-hover:text-white">
                                        Google
                                    </span>
                                </div>
                            )}
                        </motion.button>
    
                        <motion.button
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.4, delay: 1.1 }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSignUp("github")}
                            disabled={authLoading === "github"}
                            className="group relative bg-white/5 hover:bg-white/10 border dark:border-white/10 border-gray-300  dark:hover:border-white/20 rounded-xl p-4 transition-all
                                  duration-200 backdrop-blur-sm dark:hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                            {authLoading === "github" ? (
                                <Loader2 className="size-6 animate-spin dark:text-white/70 text-blue-500 mx-auto" />
                            ) : (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gray-400/20 rounded-full blur-sm group-hover:blur-md transition-all"></div>
                                        <Image
                                            src={github}
                                            alt="Github"
                                            width={24}
                                            height={24}
                                            className="relative filter brightness-0 dark:invert"
                                        />
                                    </div>
                                    <span className="text-sm font-medium dark:text-white/80 text-black/90 dark:group-hover:text-white">
                                        GitHub
                                    </span>
                                </div>
                            )}
                        </motion.button>
                    </motion.div>
    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.5 }}
                        className="mt-14 mb-6 p-4 dark:bg-emerald-500/10 border  dark:shadow-[0] bg-gray-100 shadow-gray-300 shadow-md border-gray-200 dark:border-emerald-500/20 rounded-lg">
                        <div className="flex items-center  gap-3">
                            <Lock className="size-5 text-emerald-400 flex-shrink-0" />
                            <div>
                                <p className="text-emerald-300 text-sm font-medium">Secure & Private</p>
                                <p className="text-emerald-300 text-xs mt-1">
                                    Your data is encrypted and protected.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    </div>
    
    )
}
export default login