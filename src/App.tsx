import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './utils/AuthContext';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Familles from './pages/Familles';
import FamilleDetail from './pages/FamilleDetail';
import MesCadeaux from './pages/MesCadeaux';
import AcceptInvitation from './pages/AcceptInvitation';
import RechercherFamilles from './pages/RechercherFamilles';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MesContributions from './pages/MesContributions';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/invitation/:token" element={<AcceptInvitation />} />
<Route path="/contributions" element={<MesContributions />} />
            {/* Routes protégées */}
            <Route
              path="/familles"
              element={
                <ProtectedRoute>
                  <Familles />
                </ProtectedRoute>
              }
            />
            <Route
              path="/familles/:id"
              element={
                <ProtectedRoute>
                  <FamilleDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cadeaux"
              element={
                <ProtectedRoute>
                  <MesCadeaux />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rechercher"
              element={
                <ProtectedRoute>
                  <RechercherFamilles />
                </ProtectedRoute>
              }
            />

            {/* Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;