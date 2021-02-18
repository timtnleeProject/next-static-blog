import React, { memo, useEffect } from "react";

export default memo(function Ads(props) {
  useEffect(() => {
    (window.adsbygoogle || []).push({});
  }, []);
  return (
    <>
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
      ></script>
      <ins className="adsbygoogle" {...props}></ins>
    </>
  );
});
