import User from "../models/user.js"

//this api is for getting all the users and then sorting them based on coins for leaderboard.
const getUsers=async(req,res,next)=>{
    try {
        const users=await User.find();
        res.status(200).send(users)
    } catch (error) {
        next(error)
    }
}

export {getUsers}