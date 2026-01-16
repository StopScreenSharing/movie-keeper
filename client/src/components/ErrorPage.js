import { useRouteError } from "react-router-dom";
import NavBar from "./NavBar";

function ErrorPage() {
  return (
    <>
      <NavBar />
      <main style={{ textAlign: "center", marginTop: "20px" }}>
        <h1 style={{ color: "red", fontSize: "2em" }}>
          Whoops! Something went wrong!
        </h1>
      </main>
    </>
  );
}

export default ErrorPage;
