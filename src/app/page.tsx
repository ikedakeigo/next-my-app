"use client"
import { useEffect, useState } from "react";
// import styles from "./PostList.module.css";
import Link from "next/link";
// import { Post } from "./_types/Post";
import { MicroCmsPost } from "./pp/_types/MicroCmsPost";



const PostList = () => {

  const [postsList, setPostsList] = useState<MicroCmsPost[]>([])

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch("https://840vmtpwl1.microcms.io/api/v1/posts", { // 記事のエンドポイント
        headers: {
          "X-MICROCMS-API-KEY": "bph1RS3bmZ37K4rnwICqsW1vdLMfAQWJ5BRL", // APIキーの設定
        }
      });

      const {contents} = await res.json();
      console.log("contents--->", contents)
      setPostsList(contents)
    }

    fetcher()
  }, [])

  console.log("postsList--->", postsList)

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
                        {category.name}
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
