import React, { memo, useEffect } from "react";

export default memo(function Ads(props) {
  useEffect(() => {
    if (window) (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);
  return <ins className="adsbygoogle" {...props}></ins>;
});
