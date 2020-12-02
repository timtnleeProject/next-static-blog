import classnames from "classnames";
import styles from "./styles/Tag.module.scss";
import PropTypes from "prop-types";

const Tag = (props) => {
  const { children, className, variant = "main", color = "dark", ...rest } = props;
  return (
    <span
      className={classnames(`g-bg-${variant}`, `g-color-${color}`, styles.tag, className)}
      {...rest}
    >
      {children}
    </span>
  );
};

Tag.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.string,
};

export default Tag;
