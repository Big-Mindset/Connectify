import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Toaster } from "react-hot-toast";
import Session from "@/SessionProvider/page"; 
import { getSession } from "@/lib/getserverSession";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export const metadata = {
  title: 'Welcome to Connectify',
  description: 'Connect with us and your friends',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: '/apple-icon.png', 
  },
};
export default async function RootLayout({ children }) {
  let session = await getSession()
  return (
    
    <html lang="en">
      <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <Session session={session}>
        <div className="h-dvh  bg-gradient-to-bl from-[#141414] via-50% via-[#170080] to-[#572C74]">
      <Toaster/>
      
            {children}
        </div>
        </Session>
      </body>
    </html>
    
  );
}
