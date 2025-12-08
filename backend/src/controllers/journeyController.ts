import { Request, Response } from 'express';
import JourneyResource from '../models/Journey';

// Get all journey resources (optionally filter by category)
export const getJourneyResources = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    
    const query = category ? { category } : {};
    const resources = await JourneyResource.find(query).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: resources.length,
      data: resources
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch journey resources',
      error: error.message
    });
  }
};

// Get journey resources grouped by category
export const getJourneyResourcesByCategory = async (req: Request, res: Response) => {
  try {
    // Check cache first
    const cacheKey = 'journey_resources_grouped';
    const cachedData = global.appCache.get(cacheKey);
    
    if (cachedData) {
      return res.status(200).json({
        success: true,
        data: cachedData,
        cached: true
      });
    }
    
    const resources = await JourneyResource.find().sort({ createdAt: -1 });
    
    const grouped = {
      styles: resources.filter(r => r.category === 'styles'),
      tools: resources.filter(r => r.category === 'tools'),
      resources: resources.filter(r => r.category === 'resources'),
      stores: resources.filter(r => r.category === 'stores')
    };
    
    // Cache the result
    global.appCache.set(cacheKey, grouped);
    
    res.status(200).json({
      success: true,
      data: grouped,
      cached: false
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch journey resources',
      error: error.message
    });
  }
};

// Get single journey resource
export const getJourneyResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const resource = await JourneyResource.findById(id);
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Journey resource not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: resource
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch journey resource',
      error: error.message
    });
  }
};

// Create new journey resource
export const createJourneyResource = async (req: Request, res: Response) => {
  try {
    const { title, description, url, thumbnailUrl, category } = req.body;
    
    // Validation
    if (!title || !description || !url || !thumbnailUrl || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }
    
    const resource = await JourneyResource.create({
      title,
      description,
      url,
      thumbnailUrl,
      category
    });
    
    // Invalidate cache
    global.appCache.del('journey_resources_grouped');
    
    res.status(201).json({
      success: true,
      message: 'Journey resource created successfully',
      data: resource
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to create journey resource',
      error: error.message
    });
  }
};

// Update journey resource
export const updateJourneyResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, url, thumbnailUrl, category } = req.body;
    
    const resource = await JourneyResource.findByIdAndUpdate(
      id,
      { title, description, url, thumbnailUrl, category },
      { new: true, runValidators: true }
    );
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Journey resource not found'
      });
    }
    
    // Invalidate cache
    global.appCache.del('journey_resources_grouped');
    
    res.status(200).json({
      success: true,
      message: 'Journey resource updated successfully',
      data: resource
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update journey resource',
      error: error.message
    });
  }
};

// Delete journey resource
export const deleteJourneyResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const resource = await JourneyResource.findByIdAndDelete(id);
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Journey resource not found'
      });
    }
    
    // Invalidate cache
    global.appCache.del('journey_resources_grouped');
    
    res.status(200).json({
      success: true,
      message: 'Journey resource deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete journey resource',
      error: error.message
    });
  }
};
