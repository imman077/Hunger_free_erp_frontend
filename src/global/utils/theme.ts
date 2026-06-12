import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#22c55e", // green-500
      light: "#86efac", // green-300
      dark: "#16a34a", // green-600
    },
    secondary: {
      main: "#64748b", // slate-500
    },
    background: {
      default: "#f8fafc", // slate-50
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a", // slate-900
      secondary: "#64748b", // slate-500
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h2: {
      fontSize: "1.5rem",
      fontWeight: 700,
    },
    h3: {
      fontSize: "1.25rem",
      fontWeight: 600,
    },
    h4: {
      fontSize: "1.125rem",
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
    },
    body2: {
      fontSize: "0.875rem",
    },
  },
  shape: {
    borderRadius: 8,
  },
});

export default theme;
