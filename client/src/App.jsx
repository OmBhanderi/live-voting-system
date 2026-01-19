import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PollView from "./pages/PollView";
import AdminDashboard from "./pages/AdminDashboard";
import { PollProvider } from "./context/PollContext";

function App() {
  return (
    <PollProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          {/* Navigation Bar */}
          <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <a href="/" className="text-2xl font-bold text-blue-600">
                    📊 VoteNow
                  </a>
                </div>
                <div className="flex space-x-4">
                  <a
                    href="/"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {" "}
                    Home
                  </a>

                  <a
                    href="/admin"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Admin
                  </a>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/poll/:id" element={<PollView />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <p className="text-center text-gray-600 text-sm">
                Live Voting System - Built with React & Express
              </p>
            </div>
          </footer>
        </div>
      </Router>
    </PollProvider>
  );
}

// 404 Page
const NotFound = () => (
  <div className="text-center py-12">
    <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
    <p className="text-gray-600 mb-4">Page not found</p>

    <a href="/" className="text-blue-600 hover:text-blue-700 font-medium">
      Go back home
    </a>
  </div>
);

export default App;
