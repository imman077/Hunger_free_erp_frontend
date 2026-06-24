import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "../src/styles/globals.css";
import { BrowserRouter } from "react-router-dom";
import { HeroUIProvider } from "@heroui/react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { ApolloProvider } from "@apollo/client";
import client from "./global/api/apollo-client";

console.log("main.tsx: calling createRoot");
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <BrowserRouter>
          <HeroUIProvider>
            <App />
          </HeroUIProvider>
        </BrowserRouter>
      </LocalizationProvider>
    </ApolloProvider>
  </StrictMode>
);
