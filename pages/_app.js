import "../styles/globals.scss";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <header></header>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
