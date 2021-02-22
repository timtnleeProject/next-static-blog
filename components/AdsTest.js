import React, { memo, useEffect, useRef } from "react";

export default memo(function Ads(props) {
  const content = `
  <ins class="adsbygoogle"
       style="display:block; text-align:center;"
       data-ad-layout="in-article"
       data-ad-format="fluid"
       data-ad-client="ca-pub-1331251306729236"
       data-ad-slot="3032107812"></ins>
  `;
  useEffect(() => {
    if (window) (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);
  return <div dangerouslySetInnerHTML={{ __html: content }}></div>;
});
