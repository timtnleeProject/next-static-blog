import Page from "components/Page";
import Link from "next/link";

export default function Custom404() {
  return (
    <Page.Content>
      <h1>查無此頁</h1>
      <Link href="/">
        <a className="g-color-link">返回首頁</a>
      </Link>
    </Page.Content>
  );
}
