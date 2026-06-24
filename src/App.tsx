import "./App.css";
import { ThemeProvider } from "./global/contexts/ThemeContext";
import { Toaster } from "sonner";
import { AppRoutes } from "./AppRoutes";

function App() {
  console.log("App: rendering component");
  return (
    <ThemeProvider>
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
