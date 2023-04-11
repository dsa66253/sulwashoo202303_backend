import express from "express"
import {postDraw} from "../controllers/draw.controller.js"
const router = express.Router()
router.post("/", postDraw)


export default router