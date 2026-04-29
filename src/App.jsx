import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Layout from "./components/Layout";
import Analytics from "./pages/Analytics";
import CalendarPage from "./pages/Calendar";
import Profile from "./pages/Profile";

import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";

function App() {
  return ( 
    <Router>
      <SignedIn>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Layout>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </Router>
  );
}

export default App;