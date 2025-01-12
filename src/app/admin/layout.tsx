'use client';
import React from "react";
import SideBar from "../_compornents/SideBar";
import { useRouteGuard } from "./_hook/useRouteGuard";

export default function SideBarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 管理画面のページに遷移した時にuseRouteGuardを呼び出す
  useRouteGuard()
  return (
    <div className="flex">
      <SideBar />
      <div className="w-full">{children}</div>
    </div>
  );
}
