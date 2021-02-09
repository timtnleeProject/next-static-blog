import Card from "components/Card";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

const adScript = `
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<ins class="adsbygoogle"
style="display:block;width:100%;"
data-ad-format="fluid"
data-ad-layout-key="-4m+bz-7b-d0+1ni"
data-ad-client="ca-pub-1331251306729236"
data-ad-slot="4673967329"></ins>
<script>
(adsbygoogle = window.adsbygoogle || []).push({});
</script>`;

export default function Ads() {
  const ref = useRef();
  const router = useRouter();

  useEffect(() => {
    const el = ref.current;
    el.innerHTML = adScript;
    return () => {
      el.innerHTML = "";
    };
  }, [router.asPath]);

  return (
    <Card className="g-mt-2 g-px-1">
      <div ref={ref}></div>
    </Card>
  );
}
