import { Avatar } from "components/Author";
import { BreadCrumb, bread } from "components/BreadCrumb";
import Card, { CardTitle } from "components/Card";
import Page from "components/Page";
import { useMemo } from "react";
import { SITE } from "setting";
import styles from "styles/about.module.scss";

export default function About() {
  const breadcrumbs = useMemo(() => [bread.home, bread.about], []);

  return (
    <Page.Content>
      <Page.CenterSection>
        <BreadCrumb links={breadcrumbs} />
        <Page.Title>關於</Page.Title>
        <p>關於本站...還沒有任何介紹。</p>
        <div className={styles.authorWrap}>
          <Card className={styles.card}>
            <CardTitle>Tim</CardTitle>
            <Avatar author="tim" className={styles.avatar} />
            <p>
              <b>{SITE.title}站長、開發</b>
            </p>
            <p>督促自己養成好好紀錄筆記和文章的習慣。</p>
            <div>Contact me:</div>
            <div>
              <a className="g-color-link" href="mailto:litingen1995@gmail.com">
                litingen1995@gmail.com
              </a>
            </div>
            <div>Others:</div>
            <div>
              <a
                className="g-color-link"
                href="https://github.com/timtnleeProject"
                target="__blank"
              >
                GitHub
              </a>
            </div>
          </Card>
          <Card className={styles.card}>
            <CardTitle>Anna</CardTitle>
            <Avatar author="anna" className={styles.avatar} />
            <p>
              <b>{SITE.title}共同作者</b>
            </p>
            <p>此人還未留下任何東西</p>
          </Card>
        </div>
      </Page.CenterSection>
    </Page.Content>
  );
}
