import mongoose, { Schema, Document } from "mongoose";

// Define interfaces for nested schemas
interface IContact {
  name: string;
  role: string;
  phone: string;
  email: string;
}

interface IParagraph {
  title: string;
  content: string;
}

// Define the main news document interface
interface INews extends Document {
  title: string;
  shortDescription: string;
  paragraphs: IParagraph[];
  image: string;
  date: Date;
  location?: string;
  author: string;
  contacts: IContact[];
  relatedLinks: string[];
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Contact schema for nested contact information
const ContactSchema: Schema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
});

// Paragraph schema for nested paragraphs
const ParagraphSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
});

// Main news schema
const NewsSchema: Schema = new Schema(
  {
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
  },
  { timestamps: true }
);

// Create text index for full-text search on title, shortDescription, and paragraphs
NewsSchema.index({
  title: "text",
  shortDescription: "text",
  "paragraphs.title": "text",
  "paragraphs.content": "text",
});

// Export the News model
const News = mongoose.model<INews>("News", NewsSchema);

export default News;
