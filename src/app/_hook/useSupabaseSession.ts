import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export const useSupabaseSession = () => {
  // undefind: ログイン状態ロード中、null: ログインしていない、Session: ログインしている
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [token, setToken] = useState<string | null>(null);
  const [isLoding, setIsLoding] = useState(true);

  useEffect(() => {
    const fetcher = async () => {
      const {
        data: { session }, // ログイン中であればsessionに入る
      } = await supabase.auth.getSession(); // 現在ログイン中かどうかをチェック
      setSession(session);
      setToken(session?.access_token || null);
      setIsLoding(false);
    };

    fetcher();
  }, []);

  return { session, isLoding, token };
};
