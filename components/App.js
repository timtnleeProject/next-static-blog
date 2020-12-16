import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./styles/App.module.scss";
import PropTypes from "prop-types";
import classnames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import Card from "./Card";
import { SITE } from "setting";

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

const links = [
  {
    name: "文章列表",
    href: "/",
  },
  {
    name: "關於",
    href: "/about",
  },
];

export function Nav({ show, setShow, innerRef }) {
  const close = useCallback(() => setShow(false), [setShow]);
  const route = useRouter();
  return (
    <nav ref={innerRef} className={classnames(styles.nav, show && styles.show)}>
      <Close onClick={close} />
      <Brand />
      <ul onClick={close}>
        {links.map((link) => {
          const active = link.href === route.pathname;
          return (
            <li key={link.name} className={classnames(active && styles.active)}>
              <Link href={link.href}>
                <a className="g-link-plain">
                  <span>{link.name}</span>
                </a>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function Brand() {
  const { title } = SITE;
  return (
    <Link href="/" passHref>
      <a className={styles.brand}>
        <span className={styles.l}>{title.slice(0, 2)}</span>
        <span className={styles.r}>{title.slice(2)}</span>
      </a>
    </Link>
  );
}

const headerStatus = {
  pcTransition: "pcTransition",
  fixed: "fixed",
  hide: "hide",
};

export function Header() {
  const [show, setShow] = useState(false);
  const headerRef = useRef();
  const navRef = useRef();

  useEffect(() => {
    let y = 0;
    const handleScroll = () => {
      const headerHeight = headerRef.current.getBoundingClientRect().height;
      const navHeight = navRef.current.getBoundingClientRect().height;
      const isMobile = headerHeight < navHeight;
      const offset = isMobile ? 0 : navHeight;
      const boundary = headerHeight + offset;
      const _y = document.body.getBoundingClientRect().y * -1;
      const direction = y < _y ? "down" : "up";
      if (
        _y > boundary &&
        headerRef.current.classList.contains(styles[headerStatus.hide])
      ) {
        headerRef.current.classList.add(styles[headerStatus.pcTransition]);
      } else if (
        _y <= boundary &&
        !headerRef.current.classList.contains(styles[headerStatus.fixed])
      ) {
        headerRef.current.classList.remove(styles[headerStatus.pcTransition]);
      }
      if (direction === "down") {
        // down
        if (_y > boundary) {
          headerRef.current.classList.add(styles[headerStatus.hide]);
          headerRef.current.classList.remove(styles[headerStatus.fixed]);
        }
      } else {
        // up
        if (_y <= headerHeight) {
          headerRef.current.classList.remove(
            styles[headerStatus.fixed],
            styles[headerStatus.hide],
          );
        } else {
          headerRef.current.classList.remove(styles[headerStatus.hide]);
          if (_y > boundary) {
            headerRef.current.classList.add(styles[headerStatus.fixed]);
          }
        }
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
      <header className={styles.header} ref={headerRef}>
        <Hamburger onClick={() => setShow(true)} />
        <Brand />
        <h2 className={styles.subtitle}>{SITE.subtitle}</h2>
      </header>
      <Nav show={show} setShow={setShow} innerRef={navRef}></Nav>
    </>
  );
}

export function Body(props) {
  return <div className={styles.body}>{props.children}</div>;
}

export function Content(props) {
  return (
    <Card as="main" className={styles.content}>
      {props.children}
    </Card>
  );
}

export function Aside(props) {
  return <aside className={styles.aside}>{props.children}</aside>;
}

export default {
  Nav,
  Header,
  Body,
  Content,
  Aside,
};

Content.propTypes = {
  children: PropTypes.element,
};
