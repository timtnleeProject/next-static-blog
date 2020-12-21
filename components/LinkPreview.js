import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./styles/LinkPreview.module.scss";
import classnames from "classnames";

export default function LinkPreview(props) {
  const { href, target } = props;
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState({});

  const getLinkPreview = useCallback(() => {
    fetch(`/api/link?link=${encodeURI(href)}`)
      .then((res) => res.json())
      .then((res) => {
        setPreview(res);
        setLoading(false);
      });
  }, [href]);

  const el = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver(
      function (entries, observer) {
        if (entries[0].isIntersecting) {
          getLinkPreview();
          observer.disconnect();
        }
      },
      {
        rootMargin: "400px 0px 0px 0px",
        threshold: 0,
      },
    );
    observer.observe(el.current);
    return () => {
      observer.disconnect();
    };
  }, [getLinkPreview]);

  const { images, title, description = "", url = href } = preview;

  return (
    <a
      ref={el}
      href={href}
      target={target}
      className={classnames(styles.preview, loading && styles.loading)}
    >
      <span className={styles.title}>{title}</span>
      <small className={styles.url}>{url}</small>
      <span className={styles.img}>
        <canvas width="1" height="1" />
        {images?.length > 0 && <img src={images[0]} alt={href} />}
      </span>
      <small className={styles.description}>{description}</small>
    </a>
  );
}
