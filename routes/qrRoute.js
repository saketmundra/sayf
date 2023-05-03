import express  from "express";
import {createqr,checkqr} from "../controllers/qr.js";

const router=express.Router();

router.post("/createqr",createqr)
router.post("/checkqr",checkqr)

export default router;