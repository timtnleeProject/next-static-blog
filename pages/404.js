import Page from "components/Page";
import Link from "next/link";
import styles from "styles/404.module.scss";

export default function Custom404() {
  return (
    <Page.Content>
      <Page.Title>查無此頁</Page.Title>
      <div className={styles.wrap}>
        <Link href="/">
          <a className="g-color-link">返回首頁</a>
        </Link>
      </div>
    </Page.Content>
  );
}
