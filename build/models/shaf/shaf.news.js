"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Contact schema for nested contact information
const ContactSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
});
// Paragraph schema for nested paragraphs
const ParagraphSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
});
// Main news schema
const NewsSchema = new mongoose_1.Schema({
    title: { type: String, required: true, index: true },
    shortDescription: { type: String, required: true },
    paragraphs: { type: [ParagraphSchema], required: true },
    image: { type: String, required: true },
    date: { type: Date, required: true, index: true },
    location: { type: String },
    author: { type: String, required: true, index: true },
    contacts: { type: [ContactSchema], required: true },
    relatedLinks: { type: [String], required: true },
    category: { type: String, required: true, index: true },
    tags: { type: [String], required: true, index: true },
}, { timestamps: true });
// Create text index for full-text search on title, shortDescription, and paragraphs
NewsSchema.index({
    title: "text",
    shortDescription: "text",
    "paragraphs.title": "text",
    "paragraphs.content": "text",
});
// Export the News model
const News = mongoose_1.default.model("News", NewsSchema);
exports.default = News;
