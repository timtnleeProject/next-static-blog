import App from "components/App";
import PostGroup from "components/Aside/PostGroup";
import NewPosts from "components/Aside/NewPosts";
import Head from "next/head";
import { SITE } from "setting";
import "@fortawesome/fontawesome-svg-core/styles.css"; // To prevent SVG large flash when page init at prod mode.
import "../styles/globals.scss";
import Ads from "components/Ads";

function MyApp({ Component, pageProps }) {
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
          <Component {...pageProps} />
        </App.Content>
        <App.Aside>
          <PostGroup />
          <NewPosts />
          <Ads
            style={{ display: "block", marginTop: "8px" }}
            data-ad-format="fluid"
            data-ad-layout-key="-73+ed+2i-1n-4w"
            data-ad-client="ca-pub-1331251306729236"
            data-ad-slot="6656238614"
          />
          {/* <Ads
            style={{ display: "block", marginTop: "8px" }}
            data-ad-format="fluid"
            data-ad-layout-key="-4q+bz-7b-d0+1ni"
            data-ad-client="ca-pub-1331251306729236"
            data-ad-slot="4673967329"
          /> */}
        </App.Aside>
      </App.Body>
      <App.Footer />
    </>
  );
}

export default MyApp;
