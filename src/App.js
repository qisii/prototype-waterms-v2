import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/auth/Login";
import Weekly from "./pages/visualize/Weekly";
import Building from "./pages/visualize/Building";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Login />} />
            <Route path="login">
              <Route index element={<Login />} />
            </Route>
            <Route path="dashboard">
              <Route index element={<Dashboard title="Dashboard" />} />
            </Route>
            <Route path="visualization">
              <Route path="building">
                <Route index element={<Building title="Building" />} />
              </Route>
              <Route path="weekly">
                <Route index element={<Weekly title="Weekly Report" />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
