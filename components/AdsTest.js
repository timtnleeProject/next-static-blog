import React, { memo, useEffect, useRef } from "react";

export default memo(function AdsTest() {
  const content = `
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
    <ins class="adsbygoogle"
         style="display:block; text-align:center;"
         data-ad-layout="in-article"
         data-ad-format="fluid"
         data-ad-client="ca-pub-1331251306729236"
         data-ad-slot="3032107812"></ins>
    <script>
         (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
    `;
  return <div dangerouslySetInnerHTML={{ __html: content }}></div>;
});
