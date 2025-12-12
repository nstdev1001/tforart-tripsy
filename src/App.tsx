import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useColorScheme } from "./hooks/useColorScheme";
import { Home } from "./pages/Home";
import JoinTrip from "./pages/JoinTrip";
import { Login } from "./pages/Login";
import TripPage from "./pages/Trip";

const queryClient = new QueryClient();

const theme = createTheme({
  primaryColor: "blue",
  fontFamily: "Lexend, sans-serif",
});

function AppContent() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/invite/:inviteId" element={<JoinTrip />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trip/:tripId"
          element={
            <ProtectedRoute>
              <TripPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  const { resolvedColorScheme } = useColorScheme();

  // Disable transitions on initial load
  useEffect(() => {
    document.documentElement.classList.add("no-transition");
    const timeout = setTimeout(() => {
      document.documentElement.classList.remove("no-transition");
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <MantineProvider
      theme={theme}
      defaultColorScheme={resolvedColorScheme}
      forceColorScheme={resolvedColorScheme}
    >
      <ModalsProvider>
        <Notifications position="top-right" />
        <QueryClientProvider client={queryClient}>
          <AppContent />
        </QueryClientProvider>
      </ModalsProvider>
    </MantineProvider>
  );
}

export default App;
