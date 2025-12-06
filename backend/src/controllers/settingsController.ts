import { Request, Response } from 'express';
import { Settings } from '../models/Settings';

// @desc    Get settings
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req: Request, res: Response) => {
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      // Create default settings if none exist
      settings = await Settings.create({
        storeName: 'Bubbly Crochet',
        ownerName: 'Store Owner',
        contactEmail: 'contact@bubblycrochet.com',
        contactPhone: '+1 (555) 000-0000',
        shopLocation: 'Made with love',
        copyrightText: '© 2024 Bubbly Crochet. All rights reserved.'
      });
    }

    res.json({ success: true, settings });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = async (req: Request, res: Response) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      settings = await Settings.findOneAndUpdate({}, req.body, {
        new: true,
        runValidators: true
      });
    }

    res.json({ success: true, settings });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
