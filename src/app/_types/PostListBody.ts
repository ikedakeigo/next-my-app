import { RequestCategoryBody } from "./RequestCategoryBody";

export type PostListBody = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  postCategories: {
    category: RequestCategoryBody;
  }[];
  thumbnailImageKey: string;
};
