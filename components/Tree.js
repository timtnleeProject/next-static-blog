import classnames from "classnames";
import { Fragment, memo } from "react";
import styles from "./styles/Tree.module.scss";

export default memo(function Tree(props) {
  const { tree, className } = props;
  return (
    <ul className={classnames(styles.tree, className)}>
      {tree.map((t) => {
        return (
          <Fragment key={t.id}>
            <li>
              <a href={t.href}>{t.name}</a>
            </li>
            {t.items && <Tree tree={t.items} />}
          </Fragment>
        );
      })}
    </ul>
  );
});
