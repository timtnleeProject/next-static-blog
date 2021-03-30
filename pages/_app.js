import App from "components/App";
import PostGroup from "components/Aside/PostGroup";
import Search from "components/Aside/Search";
import NewPosts from "components/Aside/NewPosts";
import Head from "next/head";
import { SITE } from "setting";
import "@fortawesome/fontawesome-svg-core/styles.css"; // To prevent SVG large flash when page init at prod mode.
import "../styles/globals.scss";
import AdsFrame from "components/AdsFrame";
import Card, { CardTitle } from "components/Card";
import { useState, useRef, useCallback, useEffect } from "react";
import Tree from "components/Tree";
import { render } from "react-dom";
import classnames from "classnames";
import styles from "../styles/_app.module.scss";
import { faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function AsideTree({ tree }) {
  const [mbTreeToggle, setMbTreeToggle] = useState(false);
  const toggle = useCallback(() => {
    setMbTreeToggle((t) => !t);
  }, []);
  return (
    <>
      {mbTreeToggle && <div className={styles.mbLayer} onClick={toggle}></div>}
      <Card className={classnames(styles.menu, mbTreeToggle && styles.mbTreeShow)}>
        <CardTitle as="h3" className={styles.menuTitle}>
          文章節錄
        </CardTitle>
        <Tree tree={tree} />
      </Card>
      <button className={styles.indicator} onClick={toggle}>
        <FontAwesomeIcon icon={faCaretUp} className={styles.menuIcon} />
        目錄
      </button>
    </>
  );
}

function MyApp({ Component, pageProps }) {
  // generate tree
  const treeRef = useRef();
  const createTree = (tree) => {
    treeRef.current.style.display = "block";
    render(<AsideTree tree={tree} />, treeRef.current);
  };
  const clearTree = () => {
    render(null, treeRef.current);
  };
  const app = {
    createTree,
    clearTree,
  };
  // display
  const posRef = useRef();
  const posTopRef = useRef();

  useEffect(() => {
    const toggleMenu = (baseElTop) => {
      const isBelowViewport = baseElTop > window.innerHeight;
      console.log(baseElTop, window.innerHeight);
      if (isBelowViewport) treeRef.current.classList.remove(styles.fixed);
      else treeRef.current.classList.add(styles.fixed);
    };
    const observer = new IntersectionObserver(
      function (entries) {
        const elEntry = entries.find((e) => e.target === posRef.current);
        console.log(entries);
        if (elEntry) {
          console.log("el");
          if (elEntry.isIntersecting) {
            treeRef.current.classList.remove(styles.fixed);
          } else {
            toggleMenu(elEntry.boundingClientRect.top);
          }
          return;
        }
        const elTopEntry = entries.find((e) => e.target === posTopRef.current);
        if (elTopEntry) {
          console.log("elTop");
          toggleMenu(posRef.current.getBoundingClientRect().top);
        }
      },
      {
        rootMargin: "-110px 0px 0px 0px",
        threshold: 0,
      },
    );
    observer.observe(posRef.current);
    observer.observe(posTopRef.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <Head>
        <meta charSet="utf-8"></meta>
        <meta property="og:site_name" content={SITE.title} />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍫</text></svg>"
        />
      </Head>
      <App.Header></App.Header>
      <App.Body>
        <App.Content>
          <Component {...pageProps} app={app} />
        </App.Content>
        <App.Aside>
          <div ref={posTopRef}></div>
          <PostGroup />
          <Search />
          <AdsFrame src="/ads/aside.html" />
          <NewPosts />
          {/* <AdsFrame src="/ads/aside2.html" /> */}
          <div ref={posRef}></div>
          <div ref={treeRef}></div>
        </App.Aside>
      </App.Body>
      <App.Footer />
    </>
  );
}

export default MyApp;
