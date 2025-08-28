import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import FileLogList from "./components/FileLogList";
import FileLogDetail from "./components/FileLogDetail";
import Header from "./components/Header";
import { Container, Box, Typography } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    h1: {
      fontSize: "2.5rem",
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box className="min-h-screen bg-gray-50">
          <Header />
          <Container maxWidth="lg" className="py-8">
            <Typography
              variant="h1"
              className="text-center mb-8 text-3xl md:text-4xl font-bold text-gray-800"
            >
              Innova Log Manager
            </Typography>
            <Routes>
              <Route path="/" element={<FileLogList />} />
              <Route path=":feature" element={<FileLogDetail />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
