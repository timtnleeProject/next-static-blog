import Card, { CardTitle } from "components/Card";
import Loader from "components/Loader";
import styles from "./PostGroup.module.scss";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import classnames from "classnames";

export default function PostGroup() {
  const [groups, setGroups] = useState(null);
  useEffect(() => {
    fetch("/api/groups")
      .then((res) => res.json())
      .then((res) => {
        setGroups(res);
      });
  }, []);

  const router = useRouter();

  return (
    <Loader.Wrap>
      <Card className={styles.group}>
        <CardTitle as="h3">文章分類</CardTitle>
        {groups ? (
          <ul>
            {groups.map((group) => {
              const active =
                router.pathname === "/post/[group]" && router.query?.group === group.name;
              return (
                <li key={group.name} className={classnames(active && styles.active)}>
                  <Link
                    href={{
                      pathname: "/post/[group]",
                      query: {
                        group: group.name,
                      },
                    }}
                    passHref
                  >
                    <a>
                      {group.display}({group.count})
                    </a>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <Loader.Spinner />
        )}
      </Card>
    </Loader.Wrap>
  );
}
