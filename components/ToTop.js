import { useCallback, useEffect, useState } from "react";
import styles from "./styles/ToTop.module.scss";

export function ToTop(props) {
  const [show, setShow] = useState(false);
  const triggerShow = useCallback((e) => {
    setShow(window.scrollY > 1000);
  }, []);
  useEffect(() => {
    window.addEventListener("scroll", triggerShow);
    return () => {
      window.removeEventListener("scroll", triggerShow);
    };
  }, [triggerShow]);

  const toTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return show ? (
    <button className={styles.totop} onClick={toTop}>
      <svg viewBox="0 0 400 360">
        <path className={styles.pathbg} d="M200 0, L400 350, L400 350, L0 350, 200 0" />
        <path className={styles.path} d="M200 0, L400 350, L400 350, L0 350, L0 350" />
      </svg>
      <div className={styles.text}>TOP</div>
    </button>
  ) : null;
}
