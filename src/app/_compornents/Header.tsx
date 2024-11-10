import Link from "next/link";
// import styles from "./Header.module.css";
const Header = () => {
  return (
    <header className="">
      <Link href="/" className="">
        Blog
      </Link>
      <Link href="/contact" className="">
        お問い合わせ
      </Link>
    </header>
  );
};

export default Header;
