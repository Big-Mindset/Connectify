"use client"
import properLogo from "@/assets/logop.webp"
import google from "@/assets/google.svg"
import github from "@/assets/github.svg"
import { Inder, Roboto } from "next/font/google"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import Input from "@/components/Input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { signupValidations } from "@/zod/userSchema"
import { motion } from "framer-motion"
import { authStore } from "@/zustand/store"
import axios from "axios"
import { ArrowRight, Loader2, Lock, Shield, UserPlus } from "lucide-react"
import toast from "react-hot-toast"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useWidth } from "../page"

const inder = Inder({
    weight: ["400"],
    subsets: ["latin"],
});
const roboto = Roboto({
    weight: ["100", "200", "300", "400", "500", "600", "700"],
    subsets: ["cyrillic-ext"]
});

const signUp = () => {
    let { loading, setLoading } = authStore()
    let router = useRouter()

    let { handleSubmit, formState: { errors }, register } = useForm({
        resolver: zodResolver(signupValidations),
        defaultValues: {
            email: "",
            name: "",
            password: ""
        }
    })
    const [authLoading, setauthLoading] = useState("")

    let handleForm = async (data) => {
        try {
            setLoading(true)
            let res = await axios.post("api/saveDataToRedis", data)
            let token = res?.data.token
            if (res.status === 200) {
                router.push(`/EmailVerification?token=${token}`)
            }
        } catch (error) {
            if (error?.response?.status === 400) {
                toast.error(error.response.data.message)
            } else {
                toast.error("Something went wrong")
            }
        } finally {
            setLoading(false)
        }
    }

    let handleSignUp = async (provider) => {
        setauthLoading(provider)
        try {
            await signIn(provider, { redirect: true })
        } catch (error) {
            toast.error("Network Error try again")
        } finally {
            setauthLoading("")
        }
    }

    let width = useWidth()
    return (
        <div className={`${inder.className} min-h-screen dark:bg-gradient-to-br bg-gray-200 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 flex items-center justify-center md:p-4 `}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative w-full max-w-lg"
            >
                {width > 786 &&
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10"
                    >
                        <div className="dark:bg-emerald-500/20 backdrop-blur-sm border bg-white/90 border-emerald-400/30 rounded-full md:px-4 md:py-2 flex items-center gap-2">
                            <Shield className="size-4 text-emerald-400" />
                            <span className="text-emerald-300 text-sm font-medium">Secure Authentication</span>
                        </div>
                    </motion.div>
                }

                {/* NOTE: on small screens we remove heavy shadow & rounded corners to look cleaner */}
                <div className="dark:bg-white/5 backdrop-blur-xl border border-white/10 md:rounded-2xl rounded-none md:shadow-2xl shadow-none overflow-hidden">

                    <div className="dark:bg-gradient-to-r dark:bg-blue-500/70 bg-blue-500 dark:from-blue-600/20 dark:to-indigo-600/20 p-3 md:p-8 text-center border-b border-white/10">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="flex flex-col items-center gap-3"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 dark:bg-blue-500/30 bg-indigo-500 rounded-full blur-lg md:block hidden"></div>
                                <div className="relative dark:bg-white/10 bg-white/90 backdrop-blur-sm border border-white/20 rounded-full p-2 md:p-3">
                                    <Image src={properLogo} alt="Logo" width={32} height={32} />
                                </div>
                            </div>

                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-white mb-1">
                                    Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Connectify</span>
                                </h1>
                                <p className="dark:text-white/60 text-white/80 text-xs md:text-sm">Create your secure account to get started</p>
                            </div>
                        </motion.div>
                    </div>

                    <div className="md:p-8 p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="text-center mb-6"
                        >
                            <p className="dark:text-white/70 text-black md:mt-0 mt-2 text-sm">
                                Already have an account?{" "}
                                <Link
                                    href="/sign-in"
                                    className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors inline-flex items-center gap-1"
                                >
                                    Sign in <ArrowRight className="size-3" />
                                </Link>
                            </p>
                        </motion.div>

                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            onSubmit={handleSubmit(handleForm)}
                            className={`${roboto.className} space-y-4 md:space-y-6`}
                        >
                            <Input
                                label="Full Name"
                                id="name"
                                placeholder="Enter your full name"
                                type="text"
                                register={register}
                                errors={errors}
                            />
                            <Input
                                label="Email Address"
                                id="email"
                                placeholder="Enter your email address"
                                type="email"
                                register={register}
                                errors={errors}
                            />
                            <Input
                                label="Password"
                                id="password"
                                placeholder="Create a strong password"
                                type="password"
                                register={register}
                                errors={errors}
                            />

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={loading}
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-800 disabled:to-indigo-800 text-white font-semibold md:py-3.5 py-3 px-6 rounded-xl transition-all duration-200 shadow-none md:shadow-lg hover:shadow-blue-600/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <Loader2 className="size-5 animate-spin" />
                                ) : (
                                    <>
                                        <UserPlus className="size-5" />
                                        Create Account
                                    </>
                                )}
                            </motion.button>
                        </motion.form>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            className="relative my-6"
                        >
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-3 bg-slate-900/50 text-white/60 backdrop-blur-sm rounded-full text-xs md:text-sm">
                                    Or continue with
                                </span>
                            </div>
                        </motion.div>

                        {/* Stack social buttons on small screens */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.5 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            <motion.button
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.4, delay: 1.0 }}
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleSignUp("google")}
                                disabled={authLoading === "google"}
                                className="group relative bg-white/5 hover:bg-white/10 border dark:border-white/10 dark:hover:border-white/20 rounded-xl p-3 md:p-4 transition-all border-gray-300 duration-200 backdrop-blur-sm dark:hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {authLoading === "google" ? (
                                    <Loader2 className="size-6 animate-spin text-blue-500 dark:text-white/70" />
                                ) : (
                                    <div className="flex items-center gap-3">
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
                                        <span className="text-sm font-medium text-black/90 dark:text-white/80">
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
                                className="group relative bg-white/5 hover:bg-white/10 border dark:border-white/10 border-gray-300 dark:hover:border-white/20 rounded-xl p-3 md:p-4 transition-all duration-200 backdrop-blur-sm dark:hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {authLoading === "github" ? (
                                    <Loader2 className="size-6 animate-spin dark:text-white/70 text-blue-500" />
                                ) : (
                                    <div className="flex items-center gap-3">
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
                                        <span className="text-sm font-medium dark:text-white/80 text-black/90">
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
                            className="mt-6 p-3 md:p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg"
                        >
                            <div className="flex items-center gap-3">
                                <Lock className="size-5 text-emerald-400 flex-shrink-0" />
                                <div>
                                    <p className="text-emerald-300 text-sm font-medium">Secure & Private</p>
                                    <p className="text-emerald-200/70 text-xs mt-1">
                                        Your data is encrypted and protected.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
export default signUp
