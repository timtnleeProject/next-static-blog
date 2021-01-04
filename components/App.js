import Link from "next/link";
import Image from "next/image";
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
    name: "首頁",
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
  const { title, splitIdx } = SITE;
  return (
    <Link href="/" passHref>
      <a className={styles.brand}>
        <div className={styles.l}>
          <div className={classnames(styles.lg, "g-color-light")}>
            {title.slice(0, splitIdx)}
          </div>
          <div className="g-color-main">Bitter</div>
        </div>
        <div className={styles.r}>
          <div className={classnames(styles.lg, "g-color-main")}>
            {title.slice(splitIdx)}
          </div>
          <div className="g-color-light">Chocolate</div>
        </div>
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
    let stamp = null; // 計算往上滑的 offset 起始點
    const store = {};

    const setConstant = () => {
      const headerHeight = headerRef.current.getBoundingClientRect().height;
      const navHeight = navRef.current.getBoundingClientRect().height;
      const isMobile = headerHeight < navHeight;
      const offset = isMobile ? 0 : navHeight;
      const boundary = headerHeight + offset;
      const scrollOffset = (isMobile ? headerHeight : navHeight) * 2;
      Object.assign(store, {
        headerHeight,
        // navHeight,
        // isMobile,
        boundary,
        scrollOffset,
      });
    };

    setConstant();

    const handleScroll = () => {
      const { headerHeight, boundary, scrollOffset } = store;
      const _y = window.scrollY;
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
        stamp = null;
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
        } else if (_y <= boundary) {
          headerRef.current.classList.remove(styles[headerStatus.hide]);
        } else {
          stamp ??= _y;
          if (stamp - _y > scrollOffset) {
            headerRef.current.classList.remove(styles[headerStatus.hide]);
            headerRef.current.classList.add(styles[headerStatus.fixed]);
            stamp = null;
          }
        }
      }
      y = _y;
    };

    const handleResize = () => {
      setConstant();
      handleScroll();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("resize", handleResize);

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
      <Image src="/up.jpg" unsized />
    </>
  );
}

export function Body(props) {
  return <div className={classnames(styles.body, props.className)}>{props.children}</div>;
}

export function Content(props) {
  return (
    <Card as="main" className={classnames(styles.content, props.className)}>
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
