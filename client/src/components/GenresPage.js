import { useContext, useEffect, useState } from  "react";
import { UserContext } from "../context/UserContext";

function GenresPage() {
    const { user, setUser } = useContext(UserContext);
    const [selectedGenreId, setSelectedGenreId] = useState(null);

    const [allGenres, setAllGenres] = useState([]);
    const [editingMovieId, setEditingMovieId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editGenreId, setEditGenreId] = useState("");

    const selectedGenre = user.genres.find((genre) => genre.id === selectedGenreId);
    useEffect(() => {
        fetch("/genres")
        .then((res) => res.json())
        .then((data) => setAllGenres(data))
        .catch((err) => console.error("failed to fetcj genres:", err));
    }, []);
    
    if (!user) return <div>Please log in</div>;
       
    function handleDeleteMovie(movieId) {
        fetch(`/movies/${movieId}`, {method: "DELETE"})
        .then((res) => {
            if (!res.ok) throw new Error("Failed to delete movie");
            return res.json();
        })
        .then((updatedUser) => {
            setUser(updatedUser);
        })
        .catch((err) => alert(err.message));
    }

    function startEditMovie(movie) {
        setEditingMovieId(movie.id);
        setEditTitle(movie.title);
        setEditGenreId(selectedGenre.id);
    }

    function handleSaveEdit(movieId) {
        fetch(`/movies/${movieId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: editTitle, genre_id: editGenreId}),
        })
        .then((res) => {
            if (!res.ok) throw new Error("Failed to edit movie");
            return res.json();
        })
        .then((updatedUser) => {
            setUser(updatedUser);
            setEditingMovieId(null);
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
                {user.genres.map((genres) => (
                    <li key={genres.id}>
                        <button onClick={() => setSelectedGenreId(genres.id)}>
                            {genres.name}
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
                                    {movie.title}
                                    <button onClick={() => startEditMovie(movie)}>Edit</button>
                                    <button onClick={() => handleDeleteMovie(movie.id)}>Delete</button>
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