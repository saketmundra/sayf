import express  from "express";
import {createqr,checkqr,getlocation} from "../controllers/qr.js";
import { verifyToken } from "../verifyToken.js";

const router=express.Router();

router.post("/createqr",createqr)
router.post("/checkqr",verifyToken,checkqr)
router.post("/location",verifyToken,getlocation)

export default router;