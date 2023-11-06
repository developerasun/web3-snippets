"use client";
import styles from "./page.module.css";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

export default function Home() {
  const { quill, quillRef } = useQuill();
  return (
    <main className={styles.main}>
      <div>
        <div style={{ width: 500, height: 500 }}>
          <div ref={quillRef} />
        </div>
      </div>
    </main>
  );
}
