import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import SignupPage from "./pages/SignupPage/SignupPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import SkillsListPage from "./pages/SkillsListPage/SkillsListPage";
import AddSkillPage from "./pages/AddSkillPage/AddSkillPage";
import SkillDetailsPage from "./pages/SkillDetailsPage/SkillDetailsPage"; 
import HomePage from "./pages/HomePage/HomePage"; 
import EditSkillPage from "./pages/EditSkillPage/EditSkillPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import EditProfile from "./pages/EditProfile";
import AdminDashboard from "./AdminDashboard";
import FindProfessorPage from "./pages/FindProfessorPage/FindProfessorPage";
import PublicProfilePage from "./pages/PublicProfilePage/PublicProfilePage";

function App() {
  return (
    <div className="App">
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/skills" element={<SkillsListPage />} />
        <Route path="/skills/create" element={<AddSkillPage />} />
        
        <Route path="/skills/:id" element={<SkillDetailsPage />} />
        
        <Route path="/skills/edit/:id" element={<EditSkillPage />} />
        
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/admin/buzon" element={<AdminDashboard />} />
        <Route path="/profesores" element={<FindProfessorPage />} />
        <Route path="/users/:id" element={<PublicProfilePage />} />
      </Routes>

    </div>
  );
}

export default App;