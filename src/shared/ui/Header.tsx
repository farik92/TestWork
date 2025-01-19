import React from "react";
import Link from "next/link";
import styles from "@/app/styles/Header.module.scss";

const Header = () => (
  <header className={styles.header}>
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link href="/" className="navbar-brand">
          WeatherApp
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link href="/favorites" className="nav-link">
                Избранные
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
);

export default Header;
