import User from "../models/user.js"


const getUsers=async(req,res,next)=>{
    try {
        const users=await User.find();
        res.status(200).send(users)
    } catch (error) {
        next(error)
    }
}

export {getUsers}