
import type { Chat } from "@google/genai";

export interface ColorInfo {
  hex: string;
  name: string;
  usage: string;
}

export interface FontPair {
  header: string;
  body: string;
  notes: string;
}

export interface BrandIdentity {
  companyName: string;
  slogan: string;
  logoPrompt: string;
  colorPalette: ColorInfo[];
  fontPairings: FontPair;
}

export interface BrandBible extends BrandIdentity {
  primaryLogoUrl: string;
  secondaryMarkUrls: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
