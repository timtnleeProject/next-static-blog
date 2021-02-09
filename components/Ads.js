const adScript = {
  aside: `
     <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
     <ins class="adsbygoogle"
          style="display:block"
          data-ad-format="fluid"
          data-ad-layout-key="-4q+bz-7b-d0+1ni"
          data-ad-client="ca-pub-1331251306729236"
          data-ad-slot="4673967329"></ins>
     <script>
          (adsbygoogle = window.adsbygoogle || []).push({});
     </script>
     `,
  post: `
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
  `,
};

export default function Ads({ type = "aside" }) {
  return (
    <div className="g-my-2" dangerouslySetInnerHTML={{ __html: adScript[type] }}></div>
  );
}
