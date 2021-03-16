import { useRouter } from "next/router";
import React, { memo, useCallback, useRef } from "react";
import styles from "./styles/SearchBar.module.scss";
import Input from "./Input";

export default memo(function SearchBar({ disabled = false, defaultValue }) {
  const router = useRouter();
  const ref = useRef();
  const search = useCallback(() => {
    router.push({
      pathname: "/search",
      query: {
        text: ref.current.value.trim(),
      },
    });
  }, [router]);
  const onKeyDown = useCallback(
    (e) => {
      if (e.keyCode === 13) search();
    },
    [search],
  );
  return (
    <div className={styles.searchbar}>
      <Input
        ref={ref}
        className={styles.input}
        onKeyDown={onKeyDown}
        disabled={disabled}
        defaultValue={defaultValue}
        placeholder="標題、預覽、標籤"
      />
      <button className={styles.btn} onClick={search}>
        搜尋
      </button>
    </div>
  );
});
