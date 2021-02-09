import { useRouter } from "next/router";
import { useEffect } from "react";

const adScript = `
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<ins class="adsbygoogle"
  style="display:block"
  data-ad-format="fluid"
  data-ad-layout-key="-4l+c0-7f-ep+1qt"
  data-ad-client="ca-pub-1331251306729236"
  data-ad-slot="4673967329"></ins>
`;

export default function Ads() {
  const router = useRouter();

  useEffect(() => {
    (window.adsbygoogle || []).push({});
  }, [router.asPath]);

  return <div dangerouslySetInnerHTML={{ __html: adScript }}></div>;
}
