import "./App.css";
import { ThemeProvider } from "./global/contexts/ThemeContext";
import { Toaster } from "sonner";
import { AppRoutes } from "./AppRoutes";
import { useNavigate } from "react-router-dom";
import { setGlobalNavigator } from "./core/navigation";
import { useEffect } from "react";

function GlobalNavigationListener() {
  const navigate = useNavigate();
  useEffect(() => {
    setGlobalNavigator(navigate);
  }, [navigate]);
  return null;
}

function App() {
  console.log("App: rendering component");
  return (
    <ThemeProvider>
      <GlobalNavigationListener />
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            fontFamily: "inherit",
            fontSize: "12px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 16px",
            paddingRight: "36px",
            lineHeight: "1.4",
          },
        }}
      />
      <div>
        <AppRoutes />
      </div>
    </ThemeProvider>
  );
}

export default App;
