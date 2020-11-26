import Link from "next/link";
import styles from "./styles/App.module.scss";
import PropTypes from "prop-types";
import classnames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useEffect, useRef, useState } from "react";

function Close(props) {
  return (
    <div className={classnames(styles.close, "g-icon")} {...props}>
      <FontAwesomeIcon icon={faTimes} />
    </div>
  );
}

function Hamburger(props) {
  return (
    <div className={classnames(styles.bars, "g-icon")} {...props}>
      <FontAwesomeIcon icon={faBars} />
    </div>
  );
}

export function Nav({ show, setShow }) {
  const close = useCallback(() => setShow(false), [setShow]);
  return (
    <nav className={classnames(styles.nav, show && styles.show)}>
      <Close onClick={close} />
      <Brand />
      <ul onClick={close}>
        <li>
          <Link href="/">
            <a>Nav001</a>
          </Link>
        </li>
        <li>Nav002</li>
        <li>Nav003</li>
      </ul>
    </nav>
  );
}

function Brand() {
  return (
    <Link href="/" passHref>
      <a className={styles.brand}>Home</a>
    </Link>
  );
}

const headerStatus = {
  normal: "normal",
  fixed: "fixed",
  hide: "hide",
};

export function Header() {
  const [status, setStatus] = useState(headerStatus.normal);
  const [show, setShow] = useState(false);
  const headerRef = useRef();

  useEffect(() => {
    let y = 0;
    const handleScroll = () => {
      const headerHeight = headerRef.current.getBoundingClientRect().height;
      const _y = document.body.getBoundingClientRect().y;
      if (_y * -1 < headerHeight) {
        setStatus(headerStatus.normal);
      } else if (y > _y) {
        setStatus(headerStatus.hide);
      } else {
        setStatus(headerStatus.fixed);
      }
      y = _y;
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header className={classnames(styles.header, styles[status])} ref={headerRef}>
        <Hamburger onClick={() => setShow(true)} />
        <Brand />
        <h2 className={styles.subtitle}>Sub title</h2>
      </header>
      <Nav show={show} setShow={setShow}></Nav>
    </>
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
