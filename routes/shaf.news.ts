import express from "express";
import { getAllNews } from "../controllers/shaf/shaf.news";
const newsRoute = express.Router();

newsRoute.get("/get-all-news", getAllNews);

export default newsRoute;
