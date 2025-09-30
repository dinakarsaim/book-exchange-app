import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const AddBook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [genre, setGenre] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");

    try {
      const res = await API.post(
        "/books",
        { title, author, description, image, genre },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Book added successfully!");
      setTitle("");
      setAuthor("");
      setDescription("");
      setImage("");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add book");
    }
  };

  return (
    <div className="add-book-container" style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>Add a New Book</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Book Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        /><br /><br />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        /><br /><br />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        /><br /><br />
        <input
          type="text"
          placeholder="Image URL (optional)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        /><br /><br />

        <select value={genre} onChange={(e) => setGenre(e.target.value)} required>
          <option value="">Select Genre</option>
          <option value="Fiction">Fiction</option>
          <option value="Science Fiction">Science Fiction</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Non-fiction">Non-fiction</option>
          <option value="Mystery">Mystery</option>
          <option value="Thriller">Thriller</option>
          <option value="Romance">Romance</option>
          <option value="Horror">Horror</option>
        </select>
        <br /><br />
        
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
};

export default AddBook;