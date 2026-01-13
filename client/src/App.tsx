import { Routes, Route } from "react-router-dom";
import "./index.css";
import PlayerDashboard from "./pages/dashboard/PlayerDashboard";
import RegisterPage from "./pages/auth/RegisterPage";
import { authApi } from "./api_services/auth_api/AuthAPIService";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<RegisterPage authApi={authApi} />}/>

      <Route path="/Player-dashboard" element={
          <PlayerDashboard />  //will be protected route
      }/>
    </Routes>
  );
}

export default App;
