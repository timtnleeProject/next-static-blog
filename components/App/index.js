import Link from "next/link";
import styles from "./App.module.scss";
import PropTypes from "prop-types";

export function Nav() {
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <Link href="/">
            <a>Home</a>
          </Link>
        </li>
        <li>1111</li>
        <li>6666</li>
      </ul>
    </nav>
  );
}

export function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Home</h1>
      <h2 className={styles.subtitle}>Sub title</h2>
      <Nav></Nav>
    </header>
  );
}

export function Content(props) {
  return <main className={styles.content}>{props.children}</main>;
}

export default {
  Nav,
  Header,
  Content,
};

Content.propTypes = {
  children: PropTypes.element,
};
