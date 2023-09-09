import styles from "./Layout.module.css";

export default function Layout(props) {
  return (
    <div className={`${styles.layout}`}>
      <>{props.content}</>
      <>{props.footer}</>
    </div>
  );
}
