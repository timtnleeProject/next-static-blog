import App from "components/App";
import PostGroup from "components/Aside/PostGroup";
import Head from "next/head";
import { SITE } from "setting";
import "@fortawesome/fontawesome-svg-core/styles.css"; // To prevent SVG large flash when page init at prod mode.
import "../styles/globals.scss";

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
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          ></script>
          <ins
            className="adsbygoogle"
            style="display:block"
            data-ad-format="fluid"
            data-ad-layout-key="-4m+bz-7b-d0+1ni"
            data-ad-client="ca-pub-1331251306729236"
            data-ad-slot="4673967329"
          ></ins>
          <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </App.Aside>
      </App.Body>
    </>
  );
}

export default MyApp;
