"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowRight, Loader, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { authStore } from "@/zustand/store";
import toast from "react-hot-toast";
import axios from "axios";
import { signIn } from "next-auth/react";

export default function OTPVerification() {
  let searchParams = useSearchParams()
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  let { loading, setLoading } = authStore()

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const [data, setdata] = useState({
    name: "",
    email: ""
  })

  useEffect(() => {
    let savedata = async () => {

      let res = await axios.post("/api/sign-up", {
        token: token,
        getData: true
      })

      let { email, name } = res.data.userData
      setdata({ ...data, email, name })
    }
    savedata()
  }, [])
  let router = useRouter()
  const [ressending, setressending] = useState(false)
  let token = searchParams.get("token")
  const handleVerifyOtp = async () => {

    try {

      setLoading(true)
      let res = await axios.post("/api/sign-up", {
        token: token,
        verifyOtp: otp.join("")
      })

      if (res.status === 201) {

        let res = await signIn("credentials", { ...data, permission: true, redirect: false })
        if (res.url !== null && res.ok) {
          toast.success("Account Created")
          router.push("/Account")

        } else {
          toast.error("Invalid Email or Password")
        }
      } else {
        toast.error(res?.data?.message)
      }
    } catch (error) {

      if (error?.response?.status === 404) {
        toast.error(error?.response?.data?.message)
      } else if (error?.response?.status === 400) {
        toast.error(error?.response?.data?.message)
      } else {
        toast.error(error?.response?.data?.message || "Check your network Connection")
      }
    } finally {
      setLoading(false)
    }
  };
  const [displaycount, setdisplaycount] = useState(0)
  let timeInterval = useRef()
  let count = useRef(0)
  let countDownEverySecond = () => {

    clearInterval(timeInterval.current)
    timeInterval.current = null

    timeInterval.current = setInterval(() => {
      count.current--
      if (count.current === 0) {
        return
      }
      setdisplaycount(count.current)
    }, 1000)

  }

  let handleResend = async () => {
    setressending(true)
    let res = await axios.put("/api/resendOtp", { token, email: data.email, name: data.name })
    console.log(res);
    
    if (res.status === 201) {
      countDownEverySecond()
      count.current = 60
    }
    setressending(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white  dark:bg-blue-800/80 rounded-lg shadow-2xl p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold dark:text-blue-500 text-gray-800 mb-2">
          Verify Your Email
        </h2>
        <p className="dark:text-white/60 text-gray-600 mb-8">
          We've sent a 6-digit code to <br />
          <span className="font-semibold dark:text-indigo-500 text-gray-800">{data.email}</span>
        </p>

        <div className="flex justify-center gap-3 mb-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !digit && index > 0) {
                  const prevInput = document.getElementById(`otp-${index - 1}`);
                  if (prevInput) prevInput.focus();
                }
              }}
            />
          ))}
        </div>
        <div className="flex justify-end mb-3">
          {displaycount > 0 ? <p>
            {displaycount}s
          </p> :
            <button
              disabled={ressending}
              onClick={handleResend}
              className="text-blue-500 hover:text-blue-600 text-sm  transition-colors"
            >
              {ressending ? <Loader2 className="animate-spin mx-auto" /> : "Resend Code"}

            </button>
          }
        </div>
        <button
          disabled={loading}
          onClick={handleVerifyOtp}
          className="w-full bg-gradient-to-r cursor-pointer from-blue-500 to-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:shadow-lg  transition-all duration-200 mb-4"
        >
          {loading ? <Loader2 className="animate-spin mx-auto" /> : "Verify Code"}

        </button>
        <Link
          href={"/sign-up"}
          className="w-full  mt-3 flex gap-1 items-center justify-center text-white font-semibold py-3 px-4 rounded-lg  transition-all duration-200 mb-4"
        >
          Go Back
          <ArrowRight className="text-blue-500 " />
        </Link>

      </div>
    </div>
  );
}
