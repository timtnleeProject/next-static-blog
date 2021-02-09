import Card from "components/Card";

export default function Ads() {
  return (
    <Card
      className="g-mt-2"
      dangerouslySetInnerHTML={{
        __html: `
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
        <ins class="adsbygoogle"
        style="display:block;width:100%;"
        data-ad-format="fluid"
        data-ad-layout-key="-4m+bz-7b-d0+1ni"
        data-ad-client="ca-pub-1331251306729236"
        data-ad-slot="4673967329"></ins>
        <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
        </script>`,
      }}
    ></Card>
  );
}
