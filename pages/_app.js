import App from "components/App";
import PostGroup from "components/Aside/PostGroup";
import Search from "components/Aside/Search";
import NewPosts from "components/Aside/NewPosts";
import Head from "next/head";
import { SITE } from "setting";
import "@fortawesome/fontawesome-svg-core/styles.css"; // To prevent SVG large flash when page init at prod mode.
import "../styles/globals.scss";
import AdsFrame from "components/AdsFrame";
import Card from "components/Card";
import { useState, useRef, useCallback } from "react";
import Tree from "components/Tree";
import { render } from "react-dom";
import classnames from "classnames";
import styles from "../styles/_app.module.scss";
import { faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function AsideTree({ tree }) {
  const [mbTreeToggle, setMbTreeToggle] = useState(true);
  const toggle = useCallback(() => {
    setMbTreeToggle((t) => !t);
  }, []);
  return (
    <div>
      <Card className={classnames(styles.menu, mbTreeToggle && styles.mbTreeShow)}>
        <Tree tree={tree} />
      </Card>
      <button className={styles.indicator} onClick={toggle}>
        <FontAwesomeIcon icon={faCaretUp} className={styles.menuIcon} />
        目錄
      </button>
    </div>
  );
}

function MyApp({ Component, pageProps }) {
  const asideRef = useRef();
  const createTree = (tree) => {
    render(<AsideTree tree={tree} />, asideRef.current);
  };
  const clearTree = () => {
    asideRef.current.innerHTML = "";
  };
  const app = {
    createTree,
    clearTree,
  };

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
          <PostGroup />
          <Search />
          <AdsFrame src="/ads/aside.html" />
          <NewPosts />
          <AdsFrame src="/ads/aside2.html" />
          <div ref={asideRef}></div>
        </App.Aside>
      </App.Body>
      <App.Footer />
    </>
  );
}

export default MyApp;
