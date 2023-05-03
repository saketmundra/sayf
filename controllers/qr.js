// import Qr from "../models/qr.js"
import crypto from "crypto"
import User from "../models/user.js"
import jwt from "jsonwebtoken";


const initVector = crypto.randomBytes(16);
const Securitykey = crypto.randomBytes(32);

const createqr = async (req, res, next) => {
    try {
        const cipher = crypto.createCipheriv(process.env.ALGORITHM, Securitykey, initVector);
        let cotk=req.cookies.access_token.split('.')
        let encryptedData = cipher.update(cotk[0]+"/"+Date.now(), "utf-8", "hex");
        encryptedData += cipher.final("hex");
        res.status(200).send(encryptedData)
    } catch (err) {
        next(err)
    }
}
const checkqr = async (req, res, next) => {
    console.log(req.headers['x-forwarded-for']);
    try {
        const decipher = crypto.createDecipheriv(process.env.ALGORITHM, Securitykey, initVector);
        let decryptedData = decipher.update(req.body.id, "hex", "utf-8");
        decryptedData += decipher.final("utf8");
        const did=decryptedData.split('/')
        const tok=req.cookies.access_token.split('.')
        if(did[0]===tok[0]){ 
            try {
                await User.findByIdAndUpdate("6451770c2697e8e88437e622", {
                    $inc: {coins:5}
            })
            res.status(200).send("Coins Updated")
            } catch (error) {
                next(error)
            }
        }
        res.status(200)
    } catch (error) {
        next(error)
    }
}


export { createqr,checkqr}