import Link from "next/link";
// import styles from "./Header.module.css";
const Header = () => {
  return (
    <header className="bg-gray-800 p-6 flex justify-between text-white">
      <Link href="/" className="text-bold font-bold">
        Blog
      </Link>
      <Link href="/contact" className="">
        お問い合わせ
      </Link>
    </header>
  );
};

export default Header;
