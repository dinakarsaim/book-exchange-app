// src/components/Sidebar.jsx
import React from "react";
import "./Sidebar.css";

const GENRES = [
  "Fiction",
  "Science Fiction",
  "Fantasy",
  "Non-fiction",
  "Mystery",
  "Thriller",
  "Romance",
  "Horror",
];

const Sidebar = ({ selectedGenre, onSelectGenre }) => {
  return (
    <aside className="sidebar">
      <div className="brand">
        <h3 className="navbar-logo">
          <span className="logo-book">BOOK</span>
          <span className="logo-hive">HIVE</span>
        </h3>
      </div>
      <h3 className="heading">Genres</h3>

      <ul className="genre-list">
        <li
          className={`genre-item ${!selectedGenre ? "active" : ""}`}
          onClick={() => onSelectGenre(null)}
        >
          All
        </li>

        {GENRES.map((g) => (
          <li
            key={g}
            className={`genre-item ${selectedGenre === g ? "active" : ""}`}
            onClick={() => onSelectGenre(g)}
          >
            {g}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;