// import React from "react";
// import ReactDOM from 'react-dom/client';
// import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import routes from './routes';
// import "./index.css";
// import { createRoot } from "react-dom/client";

// const container = document.getElementById("root");
// const root = createRoot(container);
// root.render(<App />);

// const router = createBrowserRouter(routes);

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<RouterProvider router={router} />);

import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App";
import { UserProvider } from "./context/UserContext";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
<UserProvider>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</UserProvider>
);


