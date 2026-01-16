// import React, { useEffect, useState } from "react";
// import { Switch, Route } from "react-router-dom";
// import { SignupForm } from "./SignupForm";


// function App() {
//   return <SignupForm/> 
// }
 

// export default App;
// import { Switch, Route } from "react-router-dom";
// // import ErrorPage from "./components/ErrorPage";
// import MainPage from "./MainPage";
// import { LoginForm } from "./LoginForm";
// import { SignupForm } from "./SignupForm";

// function App() {
//   return (
//     <Switch>
//       <Route exact path="/" component={MainPage} />
//       {/* <Route component={ErrorPage} /> */}
//       <Route exact path="/login" component={LoginForm} />
//       <Route path="/signup" component={SignupForm} />
//     </Switch>
//   );
// }

// export default App;

import React, { useContext } from "react";
import { Switch, Route } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import MainPage from "./MainPage";
import NavBar from "./NavBar";
import MoviesPage from "./MoviesPage";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import GenresPage from "./GenresPage";

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

      <Route path="/moviespage">
        <MoviesPage/>
      </Route>

      <Route path="/genrespage">
        <GenresPage/>
      </Route>

      <Route path="/login">
        <LoginForm />
      </Route>

      <Route path="/signup">
        <SignupForm />
      </Route>
    </Switch>
    </>
  );
}

export default App;




