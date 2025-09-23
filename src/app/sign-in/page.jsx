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
import { useWidth } from "../page"

const inder = Inder({
    weight: ["400"],
    subsets: ["latin"],
});
const roboto = Roboto({
    weight: ["100", "200", "300", "400", "500", "600", "700"],
    subsets: ["cyrillic-ext"]
});

const Login = () => {
    const [authLoading, setauthLoading] = useState("")
    const router = useRouter()
    const { loading, setLoading } = authStore()
    const { handleSubmit, formState: { errors }, register } = useForm({
        resolver: zodResolver(signinVAlidation),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const width = useWidth()

    const handleForm = async (data) => {
        setLoading(true)
        try {
            const res = await signIn("credentials", { ...data, redirect: false })
            if (res?.url !== null && res?.ok) {
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

    const handleSignUp = async (provider) => {
        setauthLoading(provider)
        try {
            await signIn(provider, { redirect: true })
        } catch (error) {
            toast.error("Network Error try again")
        } finally {
            setauthLoading("")
        }
    }

    return (
        <div className={`${inder.className} flex justify-center items-center dark:bg-gradient-to-r bg-gray-200 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 min-h-dvh md:px-4`}>
            <div className="relative w-full max-w-lg">
                {/* Improved, smaller badge — only on large screens */}
                {width > 786 && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.45, delay: 0.15 }}
                        className="absolute -top-5 left-1/2 -translate-x-1/2 z-20"
                    >
                        <div className="bg-emerald-500/10 backdrop-blur-sm border border-emerald-400/25 rounded-full px-3 py-1 flex items-center gap-2 text-emerald-300 text-sm">
                            <Shield className="size-4 text-emerald-400" />
                            <span className="hidden md:inline">Secure Authentication</span>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="min-h-full w-full overflow-hidden border bg-gradient-to-bl rounded-lg md:shadow-md shadow-none border-white/10"
                >
                    <div className="dark:bg-gradient-to-r dark:bg-blue-500/60 bg-blue-500 p-6 md:p-8 text-center border-b border-white/10">
                        <motion.div
                            initial={{ y: 16, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.45, delay: 0.25 }}
                            className="flex flex-col gap-6 items-center"
                        >
                            <div className="relative">
                                {/* subtle decorative blur only on md+ */}
                                <div className="absolute inset-0 rounded-full blur-lg md:block hidden"></div>
                                <div className="relative dark:bg-white/10 bg-white backdrop-blur-sm border border-white/20 rounded-full p-2 md:p-3">
                                    <Image src={properLogo} alt="Logo" width={32} height={32} />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <h1 className="text-lg md:text-[1.3rem] text-center text-white font-semibold">
                                    Welcome Back <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 md:text-[1.15rem]">Connectify</span>
                                </h1>
                                <p className="dark:text-white/70 text-white/50 text-xs md:text-[0.8rem]">Login to your previous account</p>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.35 }}
                        className="flex justify-center mt-6"
                    >
                        <p className="dark:text-gray-100/80 text-black/80 text-[0.88rem] flex items-center gap-1">
                            Don't have an account?
                            <Link className="text-blue-400 hover:underline hover:text-sky-300 inline-flex items-center gap-1 ml-1" href={"/sign-up"}>
                                <span>Sign up</span>
                                <ArrowRight className="size-3" />
                            </Link>
                        </p>
                    </motion.div>

                    <div className="w-full mx-auto px-6 md:px-8 py-4 md:py-6">
                        <motion.form
                            initial={{ y: 18, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.45, delay: 0.45 }}
                            onSubmit={handleSubmit(handleForm)}
                            className={`mt-4 ${roboto.className} flex flex-col gap-3 md:gap-4`}
                        >
                            <Input label="Email" id="email" placeholder="Enter your email" type="email" register={register} errors={errors} />
                            <Input label="Password" id="password" placeholder="Enter your password" type="password" register={register} errors={errors} />

                            <motion.button
                                initial={{ y: 12, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.6 }}
                                disabled={loading}
                                type="submit"
                                className="flex gap-2 items-center justify-center text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-800 disabled:to-indigo-800 rounded-md transition-all duration-300 px-3.5 py-3"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <>
                                    <span>Login</span>
                                    <LogIn />
                                </>}
                            </motion.button>
                        </motion.form>

                        <motion.div
                            initial={{ opacity: 0, scaleX: 0 }}
                            animate={{ opacity: 1, scaleX: 1 }}
                            transition={{ duration: 0.4, delay: 0.7 }}
                            className="relative my-8"
                        >
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center">
                                <span className="px-3 bg-gray-900/50 text-white/70 backdrop-blur-sm rounded-full text-xs md:text-sm">
                                    Or continue with
                                </span>
                            </div>
                        </motion.div>

                        {/* Social buttons: stacked on mobile, 2 columns on md+ */}
                        <motion.div
                            initial={{ y: 16, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.45, delay: 0.85 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-3"
                        >
                            <motion.button
                                initial={{ x: -12, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.35, delay: 0.95 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleSignUp("google")}
                                disabled={authLoading === "google"}
                                className="group relative bg-white/5 hover:bg-white/10 border dark:border-white/10 rounded-lg p-3 md:p-4 transition-all backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {authLoading === "google" ? (
                                    <Loader2 className="size-6 animate-spin text-blue-500 dark:text-white/70" />
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-sm" />
                                            <Image src={google} alt="Google" width={20} height={20} />
                                        </div>
                                        <span className="text-sm font-medium dark:text-white/80 text-black/90">Google</span>
                                    </div>
                                )}
                            </motion.button>

                            <motion.button
                                initial={{ x: 12, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.35, delay: 1.0 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleSignUp("github")}
                                disabled={authLoading === "github"}
                                className="group relative bg-white/5 hover:bg-white/10 border dark:border-white/10 rounded-lg p-3 md:p-4 transition-all backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {authLoading === "github" ? (
                                    <Loader2 className="size-6 animate-spin dark:text-white/70 text-blue-500" />
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gray-400/20 rounded-full blur-sm" />
                                            <Image src={github} alt="Github" width={20} height={20} className="filter brightness-0 dark:invert" />
                                        </div>
                                        <span className="text-sm font-medium dark:text-white/80 text-black/90">GitHub</span>
                                    </div>
                                )}
                            </motion.button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.15, duration: 0.4 }}
                            className="mt-8 md:mt-10 p-3 md:p-4 bg-emerald-500/8 border border-emerald-500/20 rounded-lg"
                        >
                            <div className="flex items-center gap-3">
                                <Lock className="size-5 text-emerald-400 flex-shrink-0" />
                                <div>
                                    <p className="text-emerald-300 text-sm font-medium">Secure & Private</p>
                                    <p className="text-emerald-300 text-xs mt-1">Your data is encrypted and protected.</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default Login
