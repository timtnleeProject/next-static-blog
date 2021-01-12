import classnames from "classnames";
import { Fragment, memo } from "react";
import styles from "./styles/Tree.module.scss";

export default memo(function Tree(props) {
  const { tree, className, depth = 1 } = props;
  return (
    <ul className={classnames(styles.tree, styles[`depth-${depth}`], className)}>
      {tree.map((t) => {
        return (
          <Fragment key={t.id}>
            <li>
              <a href={t.href}>{t.name}</a>
            </li>
            {t.items && <Tree tree={t.items} depth={depth + 1} />}
          </Fragment>
        );
      })}
    </ul>
  );
});
