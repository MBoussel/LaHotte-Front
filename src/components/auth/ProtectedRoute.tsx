import { Navigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  // Attendre que le contexte auth soit chargé
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🎄</div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si pas connecté, rediriger vers login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si connecté, afficher le contenu
  return <>{children}</>;
};

export default ProtectedRoute;