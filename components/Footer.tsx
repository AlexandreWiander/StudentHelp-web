import styles from "../styles/Home.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="flex flex-row content-start ml-10 mr-10">
        <div className="flex flex-row content-start h-16">
          <p className="font-face-pg m-auto text-lg">
            Vous avez une question ou une réclamation ?
          </p>
          <a
            href="/contact"
            className="font-face-pg ml-3 text-lg text-blue-500 hover:text-blue-800 m-auto"
          >
            Contactez-nous
          </a>
        </div>
      </div>
    </footer>
  );
}
