/**
 * WelcomeBook 型定義
 */

export interface Property {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  address?: string;
  description?: string;
  welcomeMessage?: string;
  emergencyContact?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  documentId: string;
  name: string;
  description?: string;
  icon?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  contentCount?: number;
}

export interface Content {
  id: number;
  documentId: string;
  title: string;
  body: string;
  summary?: string;
  images?: Image[];
  order: number;
  published: boolean;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface Image {
  id: number;
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: ImageFormat;
    small?: ImageFormat;
    medium?: ImageFormat;
    large?: ImageFormat;
  };
}

export interface ImageFormat {
  url: string;
  width: number;
  height: number;
}

export interface StrapiResponse<T> {
  data: T;
  meta: StrapiMeta;
}

export interface StrapiListResponse<T> {
  data: T[];
  meta: StrapiMeta;
}

export interface StrapiMeta {
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface StrapiError {
  status: number;
  name: string;
  message: string;
}
