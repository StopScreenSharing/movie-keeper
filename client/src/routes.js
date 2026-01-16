import App from "./components/App";
import MainPage from "./components/MainPage";
import GenresPage from "./components/GenresPage";
import MoviesPage from "./components/MoviesPage";
import ErrorPage from "./components/ErrorPage";

const routes = [
   {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
    
            {
                path: "/",
                element: <MainPage />
            },
            {
                path: "/genrespage",
                element: <GenresPage/>
            },
            {
                path: "/moviespage",
                element: <MoviesPage />
            },
        ]
    }
];

export default routes;