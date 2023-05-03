// import Qr from "../models/qr.js"
import crypto from "crypto"
import User from "../models/user.js"
import axios from "axios"
import ip from "ip"
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
    try {
        const decipher = crypto.createDecipheriv(process.env.ALGORITHM, Securitykey, initVector);
        let decryptedData = decipher.update(req.body.id, "hex", "utf-8");
        decryptedData += decipher.final("utf8");
        const did=decryptedData.split('/')
        const tok=req.cookies.access_token.split('.')
        if(did[0]===tok[0]){ 
            try {
                const decoded = jwt.decode(tok[0], process.env.JWT);
                console.log(decoded);
                await User.findByIdAndUpdate(req.user.id, {
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

const getlocation=async(req,res,next)=>{
    try {
        const ipaddress=ip.address()
        const options = {
            method: 'GET',
            url: 'https://ip-geolocation-ipwhois-io.p.rapidapi.com/json/',
            params: {
              ip: '122.162.144.251' // hard-coding ip address as geolocation api is paid for reserved locations. here ip address of the device will be used.
            },
            headers: {
              'X-RapidAPI-Key': '0a6bd2e73emsh028e4e85e571f0fp18f9a5jsnf2b1ba10b247',
              'X-RapidAPI-Host': 'ip-geolocation-ipwhois-io.p.rapidapi.com'
            }
          };
          try {
              const response = await axios.request(options);
              await User.findByIdAndUpdate(req.user.id,{location:response.data.latitude +","+response.data.longitude})
              res.status(200).send(response.data);
          } catch (error) {
              console.error(error);
          }
    } catch (error) {
        next(error)
    }
}


export { createqr,checkqr,getlocation}