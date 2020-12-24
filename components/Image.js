import styles from "./styles/Image.module.scss";
import classnames from "classnames";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faSearch } from "@fortawesome/free-solid-svg-icons";

export default function Image(props) {
  const { src, alt, className } = props;
  const [loaded, setLoaded] = useState(false);
  const [canZoom, setCanZoom] = useState(false);

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
    if (canZoom) {
      const imgEl = img.current;
      const inRange = (min, max) => (target) => target >= min && target <= max;
      const createMove = (offsetX, offsetY) => (e) => {
        e.preventDefault();
        const event = e.touches?.[0] || e;
        const imgPos = img.current.getBoundingClientRect();
        const x = event.clientX - imgPos.x;
        const y = event.clientY - imgPos.y;
        const percentX = (x / imgPos.width) * 100;
        const percentY = (y / imgPos.height) * 100;

        if (!inRange(-50, 150)(percentX) || !inRange(-50, 150)(percentY)) {
          zoomEl.current.style.display = "none";
        } else {
          zoomEl.current.style.display = "block";
        }
        zoomEl.current.style.left = `${x}px`;
        zoomEl.current.style.top = `${y}px`;
        zoomEl.current.style.transform = `translate(-${offsetX}%, -${offsetY}%)`;
        zoomImg.current.style.left = `${offsetX}%`;
        zoomImg.current.style.top = `${offsetY}%`;
        zoomImg.current.style.transform = `
          translate(-${percentX}%, -${percentY}%)`;
      };
      const mousemove = createMove(50, 50);
      const touchmove = createMove(50, 90);
      const enter = () => {
        zoomImg.current.style.width =
          img.current.getBoundingClientRect().width * 2 + "px";
      };
      const leave = () => {
        zoomEl.current.style.display = "none";
        setCanZoom(false);
      };
      enter();
      imgEl.addEventListener("mouseleave", leave);
      imgEl.addEventListener("touchend", leave);
      imgEl.addEventListener("mousemove", mousemove);
      imgEl.addEventListener("touchmove", touchmove);

      return () => {
        imgEl.removeEventListener("mouseleave", leave);
        imgEl.removeEventListener("touchend", leave);
        imgEl.removeEventListener("mousemove", mousemove);
        imgEl.removeEventListener("touchmove", touchmove);
      };
    }
  }, [canZoom]);

  return (
    <>
      <span className={classnames(styles.imgWrap, className, canZoom && styles.canZoom)}>
        <span className={styles.img}>
          {canZoom && (
            <span className={styles.hint}>move your finger/mouse over the image</span>
          )}
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
          {loaded &&
            (canZoom ? (
              <span className={styles.icon}>
                <FontAwesomeIcon icon={faEye} />
              </span>
            ) : (
              <span className={styles.icon} onClick={() => setCanZoom(true)}>
                <FontAwesomeIcon icon={faSearch} />
              </span>
            ))}
        </span>
      </span>
    </>
  );
}
