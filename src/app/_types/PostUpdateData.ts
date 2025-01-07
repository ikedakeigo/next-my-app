export type PostUpdateData = {
  title: string;
  content: string;
  thumbnailImageKey: string;
  categories: {
    id: number,
    name: string
  }[];
};
