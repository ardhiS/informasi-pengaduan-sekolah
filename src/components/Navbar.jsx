import React from "react";
import { BsSearch, BsGlobe, BsGeoAltFill, BsMoonStars } from "react-icons/bs";

import favicon from "../assets/images/favicon-64x64.png";

export default function Navbar({ searchField, logOutButton }) {
  return (
    <header className="navbar navbar-expand-lg bg-body-white shadow-sm">
      <div className="container">
        <a href="index.html" className="navbar-brand d-flex align-items-center">
          <img
            src={favicon}
            alt="Logo SMP At-thahirin"
            width="32"
            height="32"
            className="me-2"
          />
          <span
            className="fw-bold text-logo-gradient"
            data-lang-id="SMP PLUS AT-THAHIRIN"
          >
            SMP PLUS AT-THAHIRIN
          </span>
        </a>

        {/* Tombol toggle untuk tampilan mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="d-flex align-items-center gap-3 ms-auto">
            {/* <!-- Form pencarian --> */}

            {searchField && (
              <form className="d-flex" role="search">
                <input
                  className="form-control form-control-sm"
                  type="search"
                  placeholder="Cari..."
                  data-lang-id="Cari..."
                />
                <button
                  className="btn btn-info btn-sm ms-1 d-flex align-items-center"
                  type="submit"
                  style={{ height: "31px" }}
                >
                  <BsSearch />
                </button>
              </form>
            )}

            {/*Dropdown pemilihan bahasa*/}
            <div className="dropdown">
              <button
                className="btn btn-info btn-sm dropdown-toggle d-flex align-items-center gap-1"
                type="button"
                data-bs-toggle="dropdown"
                style={{ height: "31px" }}
              >
                <BsGlobe /> <span id="currentLang">ID</span>
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="#">
                    <BsGeoAltFill className="text-info" /> Indonesia
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    <BsGeoAltFill className="text-info" /> English
                  </a>
                </li>
              </ul>
            </div>

            {/* Tombol toggle tema gelap/terang*/}
            <button
              className="btn btn-info btn-sm d-flex align-items-center"
              style={{ height: "31px" }}
            >
              <BsMoonStars id="themeIcon" />
            </button>

            {/* Tombol keluar*/}
            {logOutButton && (
              <a
                href="login.html"
                className="btn btn-info btn-sm"
                data-lang-id="Keluar"
              >
                Keluar
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
