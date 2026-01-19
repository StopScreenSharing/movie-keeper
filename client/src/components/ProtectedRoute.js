import { Route, Redirect } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

function ProtectedRoute({ children, ...rest }) {
  const { user, loading } = useContext(UserContext);

  if (loading) return null; // or a spinner

  return (
    <Route
      {...rest}
      render={() =>
        user ? (
          children
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
}

export default ProtectedRoute;
