"user client"
import Link from 'next/link'
import React from 'react'

const SideBar = () => {
  return (
    <div className="bg-gray-200 w-80 h-screen">
      <ul>
        <li className="p-4">
          <Link href="/">記事一覧</Link>
        </li>
        <li className="p-4">
          <Link href="/">カテゴリー一覧</Link>
        </li>
      </ul>
    </div>
  )
}

export default SideBar
