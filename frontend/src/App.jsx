import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import SignupPage from "./pages/signup";
import LoginPage from "./pages/login";
import DashboardPage from "./pages/dashboard";
import ProtectedRoute from "./pages/protected";

function App() {
  return (
   <Router>
    <Routes>
       <Route path="/" element={<SignupPage/>}/>
       <Route path="/login" element={<LoginPage/>}/>
       <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage/>
        </ProtectedRoute>
       }/>
    </Routes>
   </Router>
  )
}

export default App
