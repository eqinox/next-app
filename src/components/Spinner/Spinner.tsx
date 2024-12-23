import styles from "./spinner.module.css";

const Spinner = () => {
  return (
    <div className={`${styles["atom-spinner"]}`}>
      <div className={`${styles["spinner-inner"]}`}>
        <div className={`${styles["spinner-line"]}`}></div>
        <div className={`${styles["spinner-line"]}`}></div>
        <div className={`${styles["spinner-line"]}`}></div>
        <div className={`${styles["spinner-circle"]}`}>&#9679;</div>
      </div>
    </div>
  );
};

export default Spinner;
