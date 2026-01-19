import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useFormik } from "formik";
import * as yup from "yup";

function MoviesPage() {
  const { user, setUser } = useContext(UserContext);
  const [genres, setGenres] = useState([]);
  const [showNewGenreInput, setShowNewGenreInput] = useState(false);
  const [genreError, setGenreError] = useState(null);

  // Fetch all genres
  useEffect(() => {
    fetch("/genres")
      .then((res) => res.json())
      .then((data) => setGenres(data))
      .catch((err) => console.error("Failed to fetch genres:", err));
  }, []);

  const formSchema = yup.object().shape({
    title: yup
      .string()
      .required("Movie title is required"),
    genre_id: yup
      .number()
      .required("Please select a genre"),
    new_genre: yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      genre_id: "",
      new_genre: "",
    },
    validationSchema: formSchema,
    onSubmit: (values, { resetForm }) => {
      fetch("/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title,
          genre_id: values.genre_id,
        }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to add movie");
          return res.json();
        })
        .then((updatedUser) => {
          setUser(updatedUser);
          resetForm();
          setShowNewGenreInput(false);
        })
        .catch((err) => alert(err.message));
    },
  });

  function handleGenreChange(e) {
    const value = e.target.value;

    if (value === "add_new") {
      setShowNewGenreInput(true);
      formik.setFieldValue("genre_id", "");
    } else {
      setShowNewGenreInput(false);
      formik.setFieldValue("genre_id", Number(value));
    }
  }

  function handleAddGenre() {
    if (!formik.values.new_genre.trim()) {
      setGenreError("Genre can't be empty");
      return;
    }

    setGenreError(null);

    fetch("/genres", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: formik.values.new_genre }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.error || "Failed to add genre");
          });
        }
        return res.json();
      })
      .then((newGenre) => {
        setGenres((prev) => [...prev, newGenre]);
        formik.setFieldValue("genre_id", newGenre.id);
        formik.setFieldValue("new_genre", "");
        setShowNewGenreInput(false);
      })
      .catch((err) => setGenreError(err.message));
  }

  if (!user) return <div>Please log in</div>;

  return (
    <div>
      <h1>Add a Movie</h1>

      <form onSubmit={formik.handleSubmit}>
        <label>Movie Title</label>
        <br />
        <input
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
        />
        {formik.errors.title && (
          <p style={{ color: "red" }}>{formik.errors.title}</p>
        )}

        <br />

        <label>Genre</label>
        <br />
        <select
          value={formik.values.genre_id}
          onChange={handleGenreChange}
        >
          <option value="">Select genre</option>

          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}

          <option value="add_new">➕ Add new genre…</option>
        </select>

        {formik.errors.genre_id && (
          <p style={{ color: "red" }}>{formik.errors.genre_id}</p>
        )}

        {showNewGenreInput && (
          <>
            <br />
            <input
              name="new_genre"
              placeholder="New genre name"
              value={formik.values.new_genre}
              onChange={(e) => {
                formik.handleChange(e);
                setGenreError(null);
              }}
            />
            {genreError && (
              <p style={{ color: "red" }}>{genreError}</p>
            )}
            <button type="button" onClick={handleAddGenre}>
              Add Genre
            </button>
          </>
        )}

        <br /><br />

        <button type="submit">Add Movie</button>
      </form>
    </div>
  );
}

export default MoviesPage;

