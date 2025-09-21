/** @type {import('next').NextConfig} */
const nextConfig = {
     images: {
        domains: ["res.cloudinary.com","yt3.ggpht.com","avatars.githubusercontent.com","lh3.googleusercontent.com", "api.dicebear.com","em-content.zobj.net"],  
      },
      eslint : {
        ignoreDuringBuilds : true
      }
      
};

export default nextConfig;
