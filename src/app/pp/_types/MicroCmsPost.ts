// import { useState } from "react";

export type MicroCmsPost = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  categories: {
    id: string;
    name: string;
  }[];
  thumbnail: {
    url: string;
    height: number;
    width: number;
  };
};

// const [posts, setPosts] = useState<MicroCmsPost[]>([]);
