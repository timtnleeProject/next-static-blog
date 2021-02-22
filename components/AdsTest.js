import React, { memo, useEffect, useRef } from "react";
const content = `
  <ins class="adsbygoogle"
       style="display:block; text-align:center;"
       data-ad-layout="in-article"
       data-ad-format="fluid"
       data-ad-client="ca-pub-1331251306729236"
       data-ad-slot="3032107812"></ins>
  `;
export default memo(function Ads(props) {
  const ref = useRef();

  useEffect(() => {
    ref.current.innerHTML = content;
    if (window) (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);
  return <div ref={ref}></div>;
});
