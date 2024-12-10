export type PostUpdateData = {
  title: string;
  content: string;
  thumbnailUrl: string;
  categories: {
    id: number,
    name: string
  }[];
};
