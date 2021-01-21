import { useMemo, Fragment } from "react";
import Link from "next/link";
import styles from "./styles/BreadCrumb.module.scss";

export function BreadCrumb(props) {
  const { links = [] } = props;

  const sequence = useMemo(
    () =>
      links.reduce((seq, link, i) => {
        const prev = seq[i - 1]?.href || "";
        seq.push({
          ...link,
          href: `${prev}/${link.frag}`,
        });
        return seq;
      }, []),
    [],
  );

  return (
    <div className={styles.breadcrumb}>
      <Link href="/">
        <a>首頁</a>
      </Link>
      》
      {sequence.map((link, i) => (
        <Fragment key={i}>
          {i > 0 && "》"}
          <Link href={link.href}>
            <a>{link.name}</a>
          </Link>
        </Fragment>
      ))}
    </div>
  );
}
