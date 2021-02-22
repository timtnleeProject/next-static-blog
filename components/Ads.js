import React, { memo, useEffect } from "react";

export default memo(function Ads(props) {
  useEffect(() => {
    if (window) (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);
  return (
    <div style={{ width: "100%" }}>
      <ins className="adsbygoogle" {...props}></ins>
    </div>
  );
});
