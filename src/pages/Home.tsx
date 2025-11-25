import { Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-christmas-red to-christmas-green text-white py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
            🎄 Liste de Noël en Famille 🎅
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 max-w-3xl mx-auto">
            Partagez vos envies et contribuez aux cadeaux de vos proches
          </p>
          {user ? (
            <Link
              to="/familles"
              className="inline-block bg-white text-christmas-red px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-base md:text-lg hover:bg-gray-100 transition shadow-lg"
            >
              Voir mes familles
            </Link>
          ) : (
            <Link
              to="/register"
              className="inline-block bg-white text-christmas-red px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-base md:text-lg hover:bg-gray-100 transition shadow-lg"
            >
              Commencer gratuitement
            </Link>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12">
          Comment ça marche ?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* Card 1 */}
          <div className="card text-center hover:shadow-xl transition">
            <div className="text-4xl md:text-5xl mb-4">👨‍👩‍👧‍👦</div>
            <h3 className="text-xl md:text-2xl font-bold mb-3 text-christmas-red">
              Créez votre famille
            </h3>
            <p className="text-gray-600 text-sm md:text-base">
              Créez une famille et invitez vos proches par email pour partager vos listes de cadeaux
            </p>
          </div>

          {/* Card 2 */}
          <div className="card text-center hover:shadow-xl transition">
            <div className="text-4xl md:text-5xl mb-4">🎁</div>
            <h3 className="text-xl md:text-2xl font-bold mb-3 text-christmas-red">
              Ajoutez vos cadeaux
            </h3>
            <p className="text-gray-600 text-sm md:text-base">
              Créez votre liste de cadeaux avec des photos, prix et liens. Vos proches pourront y contribuer
            </p>
          </div>

          {/* Card 3 */}
          <div className="card text-center hover:shadow-xl transition">
            <div className="text-4xl md:text-5xl mb-4">💝</div>
            <h3 className="text-xl md:text-2xl font-bold mb-3 text-christmas-red">
              Contribuez et partagez
            </h3>
            <p className="text-gray-600 text-sm md:text-base">
              Participez aux cadeaux de votre famille et marquez-les comme achetés. Tout reste secret !
            </p>
          </div>
        </div>
      </div>

      {/* Features Details */}
      <div className="bg-gray-50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12">
              ✨ Fonctionnalités
            </h2>
            
            <div className="space-y-6 md:space-y-8">
              {/* Feature 1 */}
              <div className="flex items-start gap-4 md:gap-6">
                <div className="text-3xl md:text-4xl flex-shrink-0">🔒</div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold mb-2">Contributions secrètes</h3>
                  <p className="text-gray-600 text-sm md:text-base">
                    Vous ne voyez pas qui contribue à vos cadeaux ni combien. La surprise est préservée !
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-4 md:gap-6">
                <div className="text-3xl md:text-4xl flex-shrink-0">🌍</div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold mb-2">Multi-familles</h3>
                  <p className="text-gray-600 text-sm md:text-base">
                    Partagez le même cadeau dans plusieurs familles. Les contributions s'additionnent !
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-4 md:gap-6">
                <div className="text-3xl md:text-4xl flex-shrink-0">📧</div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold mb-2">Invitations par email</h3>
                  <p className="text-gray-600 text-sm md:text-base">
                    Invitez vos proches facilement par email. Ils recevront une invitation personnalisée.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex items-start gap-4 md:gap-6">
                <div className="text-3xl md:text-4xl flex-shrink-0">🎭</div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold mb-2">Contributions anonymes</h3>
                  <p className="text-gray-600 text-sm md:text-base">
                    Choisissez de contribuer anonymement si vous préférez rester discret.
                  </p>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="flex items-start gap-4 md:gap-6">
                <div className="text-3xl md:text-4xl flex-shrink-0">✅</div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold mb-2">Statut "Acheté"</h3>
                  <p className="text-gray-600 text-sm md:text-base">
                    Marquez un cadeau comme acheté pour que personne d'autre ne l'achète en double.
                  </p>
                </div>
              </div>

              {/* Feature 6 */}
              <div className="flex items-start gap-4 md:gap-6">
                <div className="text-3xl md:text-4xl flex-shrink-0">🖼️</div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold mb-2">Photos et liens</h3>
                  <p className="text-gray-600 text-sm md:text-base">
                    Ajoutez des photos et des liens d'achat pour que tout le monde sache exactement quel cadeau vous voulez.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!user && (
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="bg-gradient-to-r from-christmas-green to-christmas-red text-white rounded-2xl p-8 md:p-12 text-center shadow-xl">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
              Prêt à organiser Noël ? 🎄
            </h2>
            <p className="text-base md:text-lg lg:text-xl mb-6 md:mb-8 max-w-2xl mx-auto">
              Créez votre compte gratuitement et commencez à partager vos listes de cadeaux avec votre famille
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="w-full sm:w-auto bg-white text-christmas-red px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-base md:text-lg hover:bg-gray-100 transition shadow-lg"
              >
                Créer mon compte gratuitement
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto bg-transparent border-2 border-white text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-base md:text-lg hover:bg-white hover:text-christmas-red transition"
              >
                J'ai déjà un compte
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 md:py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg md:text-xl font-bold mb-2">🎄 Liste de Noël</p>
          <p className="text-sm md:text-base text-gray-400">
            Partagez la magie de Noël avec vos proches
          </p>
          <p className="text-xs md:text-sm text-gray-500 mt-4">
            © 2025 Liste de Noël - Tous droits réservés
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;