import React, { memo } from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { SITE } from "setting";
function PageMetadata({ title, image, description, home = false }) {
  const fullTitle = home ? title : `${title} - ${SITE.title}`;
  // useEffect(() => {
  //   const adScript = document.createElement("SCRIPT");
  //   adScript.setAttribute("data-ad-client", "ca-pub-1331251306729236");
  //   adScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
  //   adScript.async = true;
  //   document.head.appendChild(adScript);
  //   console.log("append");
  //   return () => {
  //     console.log("remove", adScript);
  //     document.head.removeChild(adScript);
  //   };
  // }, []);
  return (
    <Head>
      <title>{fullTitle}</title>
      <meta property="og:title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
    </Head>
  );
}

PageMetadata.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string,
};
export default memo(PageMetadata);
