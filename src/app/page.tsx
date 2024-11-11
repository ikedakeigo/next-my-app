"use client"
import { useEffect, useState } from "react";
// import styles from "./PostList.module.css";
import Link from "next/link";
import { Post } from "./_types/Post";



const PostList = () => {

  const [postsList, setPostsList] = useState<Post[]>([])

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch("https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts");
      const data = await res.json();
      setPostsList(data.posts)
    }

    fetcher()
  }, [])

  return (
    <ul>
      {postsList.map((post) => (
        <li className="" key={post.id}>
          {/* Linkコンポーネントを使用して詳細ページに遷移 */}
          <Link href={`/posts/${post.id}`} className="">
            <div className="">
              <div>
                <div className="">
                  <div className="">{new Date(post.createdAt).toLocaleDateString()}</div>
                  <div className="">
                    {post.categories.map((category, index) => (
                      <span className="" key={index}>
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="">{post.title}</p>
                <div className="" dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default PostList;
