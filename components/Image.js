import styles from "./styles/Image.module.scss";
import { useEffect, useRef, useState } from "react";

export default function Image(props) {
  const { src, alt } = props;
  const [loaded, setLoaded] = useState(false);

  const img = useRef();
  const zoomEl = useRef();
  const zoomImg = useRef();
  useEffect(() => {
    if (img.current?.complete) setLoaded(true);
    else {
      const el = img.current;
      const complete = () => {
        setLoaded(true);
      };
      el.addEventListener("load", complete);
      return () => {
        el.removeEventListener("load", complete);
      };
    }
  }, []);

  useEffect(() => {
    if (loaded) {
      const imgEl = img.current;
      const move = (e) => {
        e.preventDefault();
        const event = e.touches?.[0] || e;
        const imgPos = img.current.getBoundingClientRect();
        const x = event.clientX - imgPos.x;
        const y = event.clientY - imgPos.y;
        zoomEl.current.style.left = x + "px";
        zoomEl.current.style.top = y + "px";
        zoomImg.current.style.transform = `translate(-${(x / imgPos.width) * 100}%, -${
          (y / imgPos.height) * 100
        }%)`;
      };
      const enter = (e) => {
        zoomEl.current.style.display = "block";
        zoomImg.current.style.width =
          img.current.getBoundingClientRect().width * 2 + "px";
        move(e);
      };
      const leave = (e) => {
        zoomEl.current.style.display = "none";
      };
      imgEl.addEventListener("touchstart", enter);
      imgEl.addEventListener("mouseenter", enter);
      imgEl.addEventListener("mouseleave", leave);
      imgEl.addEventListener("touchend", leave);
      imgEl.addEventListener("mousemove", move);
      imgEl.addEventListener("touchmove", move);

      return () => {
        imgEl.removeEventListener("touchstart", enter);
        imgEl.removeEventListener("mouseenter", enter);
        imgEl.removeEventListener("mouseleave", leave);
        imgEl.removeEventListener("touchend", leave);
        imgEl.removeEventListener("mousemove", move);
        imgEl.removeEventListener("touchmove", move);
      };
    }
  }, [loaded]);

  return (
    <>
      <span className={styles.imgWrap}>
        <span className={styles.img}>
          <img src={src} alt={alt} ref={img} />
          {loaded && (
            <span className={styles.zoomArea} ref={zoomEl}>
              <canvas width="1" height="1"></canvas>
              <img src={src} alt={alt} ref={zoomImg} />
            </span>
          )}
        </span>
        <span className={styles.info}>
          <small>{alt}</small>
        </span>
      </span>
    </>
  );
}
