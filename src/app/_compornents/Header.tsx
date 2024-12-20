"use client"

import { supabase } from "@/utils/supabase";
import Link from "next/link";
import { useSupabaseSession } from "../_hook/useSupabaseSession";
// import styles from "./Header.module.css";
const Header: React.FC = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const { session, isLoding } = useSupabaseSession();

  return (
    <header className="bg-gray-800 p-6 flex justify-between text-white">
      <Link href="/" className="text-bold font-bold">
        Blog
      </Link>
      {/* ログイン中の読み込み中は何もしないようにisLoadingで待機 */}
      {!isLoding && (
        <div className="flex items-center gap-4">
          {/* sessionにログイン情報があれば管理画面をheaderに表示 */}
          {session ? (
            <>
              <Link href="/admin" className="header-link">
                管理画面
              </Link>
              <button onClick={handleLogout}>ログアウト</button>
            </>
          ) : (
            <>
              <Link href="/contact" className="header-link">
                お問い合わせ
              </Link>
              <Link href="/login" className="header-link">
                ログイン
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
