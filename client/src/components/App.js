
import React, { useContext } from "react";
import { Switch, Route } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import MainPage from "./MainPage";
import NavBar from "./NavBar";
import MoviesPage from "./MoviesPage";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import GenresPage from "./GenresPage";
import ErrorPage from "./ErrorPage";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    
    return <div>Loading...</div>;
  }

  return (
    <>
    {user && <NavBar />}

    <Switch>
      <Route exact path="/">
        {user ? <MainPage /> : <LoginForm />}
      </Route>

      <ProtectedRoute path="/moviespage">
        <MoviesPage/>
      </ProtectedRoute>

      <ProtectedRoute path="/genrespage">
        <GenresPage/>
      </ProtectedRoute>

      <Route path="/login">
        <LoginForm />
      </Route>

      <Route path="/signup">
        <SignupForm />
      </Route>

      <Route path="*">
        <Redirect to ="/" />
      </Route>
    </Switch>
    </>
  );
}

export default App;




