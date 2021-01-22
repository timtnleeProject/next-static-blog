import { useMemo, Fragment } from "react";
import Link from "next/link";
import styles from "./styles/BreadCrumb.module.scss";

export const bread = {
  home: {
    frag: "",
    name: "首頁",
  },
  post: {
    frag: "post",
    name: "文章",
  },
  about: {
    frag: "about",
    name: "關於",
  },
};

export function BreadCrumb(props) {
  const { links = [] } = props;

  const sequence = useMemo(
    () =>
      links.reduce((seq, link, i) => {
        const prev = seq[i - 1]?.href || "";
        seq.push({
          ...link,
          href: `${prev}${link.frag}/`,
        });
        return seq;
      }, []),
    [links],
  );

  return (
    <div className={styles.breadcrumb}>
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
