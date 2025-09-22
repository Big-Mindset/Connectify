
import "./globals.css";

import { Geist, Geist_Mono,Roboto } from "next/font/google";

import { Toaster } from "react-hot-toast";
import Session from "@/SessionProvider/page"; 
import { getSession } from "@/lib/getserverSession";
import ThemeProvider from "@/components/ThemeProvider";
import AddsystemTheme from "@/components/AddsystemTheme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const roboto = Roboto({
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
  console.log("The session is ");
    console.log(session);
    
  return (
    
    <html lang="en" suppressHydrationWarning>
      <body
      className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} antialiased`}>
        <ThemeProvider>
      <AddsystemTheme />
      <Session session={session}>
        <div className="min-h-dvh bg-gradient-to-br  overflow-hidden  from-slate-950 via-blue-950 to-slate-900">
      <Toaster/>
            {children}
        </div>
        </Session>
        </ThemeProvider>
      </body>
    </html>
    
  );
}
