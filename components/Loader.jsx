import React from "react";
import { ThreeCircles } from "react-loader-spinner";
import styles from "../styles/Loader.module.css";

const Loader = () => {
  return (
    <div className={styles.container}>
      <ThreeCircles
        height="100"
        width="100"
        color="#A3A3A3"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="three-circles-rotating"
        outerCircleColor=""
        innerCircleColor=""
        middleCircleColor=""
      />
    </div>
  );
};

export default Loader;
