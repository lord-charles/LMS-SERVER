"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const shaf_news_1 = require("../controllers/shaf/shaf.news");
const newsRoute = express_1.default.Router();
newsRoute.get("/get-all-news", shaf_news_1.getAllNews);
exports.default = newsRoute;
