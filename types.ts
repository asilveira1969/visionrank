
export interface Profile {
  id: string;
  name: string;
  country: string;
  about: string;
  category: string;
  profileImage: string;
  galleryImages: string[];
  views: number;
  rank: number;
  uploadedAt: number;
}

export interface GeminiProfileResponse {
  name: string;
  country: string;
  about: string;
  category: string;
}

export interface BlogImage {
  id: string;
  url: string;
  title: string;
  description: string;
  category: string;
  views: number;
  rank: number;
  uploadedAt: number;
  country?: string;
}
