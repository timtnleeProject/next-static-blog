import { useEffect } from "react";

export default function Ads(props) {
  useEffect(() => {
    (window.adsbygoogle || []).push({});
  }, []);
  return <ins className="adsbygoogle g-my-2" {...props}></ins>;
}
