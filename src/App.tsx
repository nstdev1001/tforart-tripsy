import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Home } from "./pages/Home";
import JoinTrip from "./pages/JoinTrip";
import { Login } from "./pages/Login";
import TripPage from "./pages/Trip";

const queryClient = new QueryClient();

function App() {
  return (
    <MantineProvider>
      <ModalsProvider>
        <Notifications position="top-right" />
        <QueryClientProvider client={queryClient}>
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
        </QueryClientProvider>
      </ModalsProvider>
    </MantineProvider>
  );
}

export default App;
