import axios from "axios";

export let refreshed_Token = async (token)=>{
try {
    let res = await axios.post("https://oauth2.googleapis.com/token",
        new URLSearchParams({
            client_id : process.env.CLIENT_ID,
            client_secret : process.env.CLIENT_SECRET,
            grant_type : "refresh_token",
            refresh_token: token.refreshToken
        }),
        {
            headers : {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        },

    )
    let refreshedToken = res.data
    
    return {
        ...token,
        accessToken : refreshedToken.access_token,
        refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
        accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000
    }
}catch (error){
    console.log(error?.response);
    
    console.log(error.message || error?.response?.data || "Error again occur");
    return {
        ...token,
        error : "error refreshing token"
    }
}
}