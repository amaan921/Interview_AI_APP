import jwt from "jsonwebtoken";

export const generateToken = async (userId) =>{
    try{
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return token;
    }
    catch(error){
        console.error("Error generating token:", error);
        throw new Error("Token generation failed");
    }
}
export default generateToken;



export const logOut= async (req,res) =>{
    try{
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        });
        return res.status(200).json({message: "Logout successful"});
    }
    catch(error){
        console.error("Logout Error:", error);
        return res.status(500).json({message: "Logout failed"});
    }
}   