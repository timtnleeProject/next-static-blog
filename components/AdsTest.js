import React, { memo, useEffect } from "react";

export default memo(function Ads(props) {
  useEffect(() => {
    if (window) (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);
  return (
    <div style={{ width: "100%", minWidth: "250px" }}>
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
      ></script>
      <ins className="adsbygoogle" {...props}></ins>
    </div>
  );
});
