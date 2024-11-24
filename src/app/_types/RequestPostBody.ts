import { RequestCategoryBody } from "./RequestCategoryBody";

export type RequestPostBody = {
  id: number;
  title: string;
  content: string;
  thumbnailUrl: string;
  postCategories: {
    category: RequestCategoryBody
  }[]
}
