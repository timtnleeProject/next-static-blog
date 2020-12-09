import styles from "./styles/Loader.module.scss";

export function Wrap(props) {
  return <div className={styles.wrap}>{props.children}</div>;
}
export function Spinner(props) {
  return <div className={styles.spinner}></div>;
}

export default {
  Spinner,
  Wrap,
};
