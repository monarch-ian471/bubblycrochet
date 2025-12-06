import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  storeName: string;
  ownerName: string;
  contactEmail: string;
  contactPhone: string;
  shopLocation: string;
  logoUrl: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
  copyrightText: string;
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    storeName: {
      type: String,
      required: true,
      default: 'Bubbly Crochet'
    },
    ownerName: {
      type: String,
      required: true
    },
    contactEmail: {
      type: String,
      required: true
    },
    contactPhone: {
      type: String,
      required: true
    },
    shopLocation: {
      type: String,
      default: ''
    },
    logoUrl: {
      type: String,
      default: 'https://ui-avatars.com/api/?name=BC&background=d946ef&color=fff'
    },
    instagramUrl: {
      type: String
    },
    tiktokUrl: {
      type: String
    },
    youtubeUrl: {
      type: String
    },
    copyrightText: {
      type: String,
      default: '© 2024 Bubbly Crochet. All rights reserved.'
    }
  },
  {
    timestamps: true
  }
);

export const Settings = mongoose.model<ISettings>('Settings', SettingsSchema);
