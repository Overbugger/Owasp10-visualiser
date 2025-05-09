// Loading.tsx
import React from "react";
import styles from "./Loading.module.css";
import Image from "next/image";

const Loading = () => {
  return (
    <div className={styles.loadingContainer}>
      <Image
        src="/icon.png"
        width={200}
        height={200}
        priority={true}
        alt="Loading..."
        className={`${styles.loadingIcon}`}
      />
    </div>
  );
};

export default Loading;
