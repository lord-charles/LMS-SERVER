import { Request, Response } from "express";
import News from "../../models/shaf/shaf.news";
import { redis } from "../../utils/redis"; // Import your Redis client

// Define the SortOrder type if not already imported
type SortOrder = 1 | -1;

// Controller to fetch all news with pagination, sorting, filtering, and caching
export const getAllNews = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Extract query parameters for pagination, sorting, and filtering
    const {
      page = 1,
      limit = 10,
      sortBy = "date",
      sortOrder = "desc",
      search = "",
      category = "",
      tags = "",
    } = req.query;

    // Convert query parameters to appropriate types
    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);

    // Define the sort order
    const sortOrderNumber: SortOrder = sortOrder === "asc" ? 1 : -1;
    const sort: { [key: string]: SortOrder } = {
      [sortBy as string]: sortOrderNumber,
    };

    // Build the filter object
    const filter: any = {};

    if (search) {
      filter.$text = { $search: search as string };
    }

    if (category) {
      filter.category = category as string;
    }

    if (tags) {
      filter.tags = { $in: (tags as string).split(",") };
    }

    // Generate cache key
    const cacheKey = `news_${pageNumber}_${pageSize}_${sortBy}_${sortOrder}_${search}_${category}_${tags}`;

    // Check if the response is in the cache
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      // Log cache hit
      console.log(`Cache hit for key: ${cacheKey}`);

      // Parse and return the cached data
      const newsData = JSON.parse(cachedData);
      res.status(200).json({
        success: true,
        data: newsData.data,
        pagination: newsData.pagination,
      });
      return; // Ensure to exit after sending the response
    }

    // Fetch the news with pagination, sorting, and filtering
    const news = await News.find(filter)
      .sort(sort) // Use the correctly formatted sort object
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    console.log("Fetched news:", news);

    // Get the total count of news for pagination
    const totalNews = await News.countDocuments(filter);

    // Prepare the response data
    const responseData = {
      data: news,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalNews / pageSize),
        pageSize,
        totalNews,
      },
    };

    // Cache the response data only if there is news data
    if (news.length > 0) {
      await redis.set(cacheKey, JSON.stringify(responseData), "EX", 3600); // Cache for 1 hour
    }

    // Send the response with news data and pagination info
    res.status(200).json({
      success: true,
      data: news,
      pagination: responseData.pagination,
    });
  } catch (error: any) {
    // Log error for debugging
    console.error("Error fetching news:", error.message);

    res.status(500).json({
      success: false,
      message: "An error occurred while fetching news",
      error: error.message,
    });
  }
};
