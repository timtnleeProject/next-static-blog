import React, { memo, useEffect } from "react";

export default memo(function Ads(props) {
  useEffect(() => {
    (window.adsbygoogle || []).push({});
  }, []);
  return <ins className="adsbygoogle" {...props}></ins>;
});
