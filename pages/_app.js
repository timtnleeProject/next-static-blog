import App from "components/App";
import PostGroup from "components/Aside/PostGroup";
import Head from "next/head";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <App.Header></App.Header>
      <App.Body>
        <App.Content>
          <Component {...pageProps} />
        </App.Content>
        <App.Aside>
          <PostGroup />
        </App.Aside>
      </App.Body>
    </>
  );
}

export default MyApp;
