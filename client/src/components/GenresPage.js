import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";

function GenresPage() {
  const { user, setUser } = useContext(UserContext);
  const [selectedGenreId, setSelectedGenreId] = useState(null);
  const [allGenres, setAllGenres] = useState([]);
  const [editingMovieId, setEditingMovieId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editGenreId, setEditGenreId] = useState("");

  useEffect(() => {
    fetch("/genres")
      .then((res) => res.json())
      .then((data) => setAllGenres(data))
      .catch((err) => console.error("Failed to fetch genres:", err));
  }, []);

  if (!user) return <div>Please log in</div>;

  const selectedGenre = user.genres.find((g) => g.id === selectedGenreId);
  

  function handleDeleteMovie(movieId) {
    fetch(`/movies/${movieId}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete movie");
        return res.json();
      })
      .then(({ id }) => {
        setUser((prevUser) => ({
          ...prevUser,
          genres: prevUser.genres.map((genre) => ({
            ...genre,
            movies: genre.movies.filter((movie) => movie.id !== movieId),
          }))
          .filter((genre) => genre.movies.length > 0),
        }));

        setSelectedGenreId((prevId) => {
            const remainingGenre = user.genres.find(
                (g) => g.id === prevId && g.movies.length > 1
            );
            return remainingGenre ? prevId : null;
        });
      })
      .catch((err) => alert(err.message));
  }


  function startEditMovie(movie) {
    setEditingMovieId(movie.id);
    setEditTitle(movie.title);
    setEditGenreId(selectedGenreId);
  }

  
  function handleSaveEdit(movieId) {
  fetch(`/movies/${movieId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: editTitle, genre_id: editGenreId }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to edit movie");
      return res.json();
    })
    .then((updatedMovie) => {
      setUser((prevUser) => {
        // removing the movie from all genres
        let updatedGenres = prevUser.genres
          .map((g) => ({
            ...g,
            movies: g.movies.filter((m) => m.id !== updatedMovie.id),
          }))
          .filter((g) => g.movies.length > 0); // remove empty genres

        // Add movie to the correct genre
        let targetGenre = updatedGenres.find((g) => g.id === updatedMovie.genre_id);
        if (targetGenre) {
          targetGenre.movies = [...targetGenre.movies, updatedMovie];
        } else {
          // If user doesn't have genre yet add it
          const genreData = allGenres.find((g) => g.id === updatedMovie.genre_id);
          if (genreData) {
            updatedGenres.push({ ...genreData, movies: [updatedMovie] });
          }
        }

        return { ...prevUser, genres: updatedGenres };
      });

      setSelectedGenreId(updatedMovie.genre_id);
      setEditingMovieId(null);
      setEditTitle("");
      setEditGenreId("");
    })
    .catch((err) => alert(err.message));
}

  function handleCancelEdit() {
    setEditingMovieId(null);
    setEditTitle("");
    setEditGenreId("");
  }

  return (
    <div>
      <h1>{user.name}'s Genres</h1>

      <ul>
        {user.genres.map((genre) => (
          <li key={genre.id}>
            <button onClick={() => setSelectedGenreId(genre.id)}>
              {genre.name}
            </button>
          </li>
        ))}
      </ul>

      {selectedGenre && (
        <div>
          <h2>Movies in {selectedGenre.name}</h2>
          <ul>
            {selectedGenre.movies.map((movie) => (
              <li key={movie.id}>
                {editingMovieId === movie.id ? (
                  <>
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <select
                      value={editGenreId}
                      onChange={(e) => setEditGenreId(Number(e.target.value))}
                    >
                      {allGenres.map((genre) => (
                        <option key={genre.id} value={genre.id}>
                          {genre.name}
                        </option>
                      ))}
                    </select>
                    <button onClick={() => handleSaveEdit(movie.id)}>Save</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    {movie.title}{" "}
                    <button onClick={() => startEditMovie(movie)}>Edit</button>
                    <button onClick={() => handleDeleteMovie(movie.id)}>
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default GenresPage;