import { Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-[#f7f6f1]">
      <section className="relative overflow-hidden bg-[#1d4033] text-white">
        <div className="absolute inset-0 opacity-[0.08]" aria-hidden="true">
          <div className="absolute -right-20 -top-32 h-[28rem] w-[28rem] rounded-full border border-white" />
          <div className="absolute -right-8 -top-20 h-[24rem] w-[24rem] rounded-full border border-white" />
        </div>
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 sm:px-8 md:grid-cols-[1.15fr_0.85fr] md:py-28">
          <div className="max-w-2xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-[#d5c39b]">Les fêtes se préparent ensemble</p>
            <h1 className="font-serif text-4xl font-medium leading-[1.12] tracking-tight sm:text-5xl md:text-6xl">
              Les plus beaux cadeaux sont ceux que l’on partage.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
              Réunissez les envies de toute la famille, organisez les cadeaux et participez facilement aux surprises de vos proches.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              {user ? (
                <Link to="/familles" className="inline-flex items-center justify-center rounded-lg bg-[#f4f0e7] px-6 py-3.5 text-sm font-semibold text-[#1d4033] hover:bg-white">
                  Voir mes familles
                </Link>
              ) : (
                <Link to="/register" className="inline-flex items-center justify-center rounded-lg bg-[#f4f0e7] px-6 py-3.5 text-sm font-semibold text-[#1d4033] hover:bg-white">
                  Créer mon espace
                </Link>
              )}
              <Link to={user ? "/cadeaux" : "/login"} className="inline-flex items-center justify-center rounded-lg border border-white/30 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10">
                {user ? 'Découvrir les cadeaux' : 'J’ai déjà un compte'}
              </Link>
            </div>
          </div>
          <div className="hidden md:flex md:justify-end">
            <div className="w-full max-w-sm border border-white/15 bg-white/[0.06] p-7">
              <p className="text-xs uppercase tracking-[0.2em] text-[#d5c39b]">L’esprit de LaHotte</p>
              <div className="my-8 h-px bg-white/20" />
              <p className="font-serif text-3xl leading-snug">Une liste commune.<br />Des attentions pour chacun.</p>
              <p className="mt-5 text-sm leading-6 text-white/65">Chacun ajoute ses idées, les proches se réunissent pour offrir, et la surprise reste entière.</p>
              <div className="mt-8 flex items-center gap-3 text-xs text-white/65">
                <span className="h-2 w-2 rounded-full bg-[#c6b184]" />
                Simple, familial et confidentiel
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a7651]">Comment ça marche</p>
          <h2 className="mt-3 font-serif text-3xl font-medium text-[#203d32] sm:text-4xl">Tout devient plus simple à plusieurs.</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">Une organisation claire pour profiter pleinement du plaisir d’offrir.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            { number: '01', title: 'Réunissez votre famille', description: 'Créez votre espace et retrouvez vos proches dans un même endroit.' },
            { number: '02', title: 'Partagez vos envies', description: 'Ajoutez vos idées de cadeaux, avec les détails utiles pour les retrouver.' },
            { number: '03', title: 'Offrez ensemble', description: 'Chacun peut participer à un cadeau, sans dévoiler la surprise.' },
          ].map((item) => (
            <article key={item.number} className="border border-stone-200 bg-white p-7">
              <p className="font-serif text-2xl text-[#a28c60]">{item.number}</p>
              <h3 className="mt-6 text-lg font-semibold text-[#203d32]">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-stone-200 bg-[#eeeee7]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-2 md:items-center md:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a7651]">Une surprise bien gardée</p>
            <h2 className="mt-3 font-serif text-3xl font-medium leading-tight text-[#203d32] sm:text-4xl">L’organisation reste discrète. La surprise aussi.</h2>
          </div>
          <p className="text-base leading-7 text-slate-600">
            Les informations de contribution sont réservées aux personnes qui organisent les cadeaux. Les bénéficiaires peuvent profiter de leur liste sans voir qui participe ni les montants réunis.
          </p>
        </div>
      </section>

      {!user && (
        <section className="mx-auto max-w-7xl px-5 py-16 text-center sm:px-8 md:py-20">
          <h2 className="font-serif text-3xl font-medium text-[#203d32]">Prêts à préparer les fêtes ensemble ?</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-600">Créez votre compte et commencez à organiser les cadeaux de votre famille.</p>
          <Link to="/register" className="mt-7 inline-flex rounded-lg bg-[#214638] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#17392f]">
            Créer mon compte gratuitement
          </Link>
        </section>
      )}

      <footer className="bg-[#19372c] px-5 py-9 text-center text-white sm:px-8">
        <p className="font-serif text-xl">LaHotte</p>
        <p className="mt-2 text-sm text-white/60">Le plaisir d’offrir, ensemble.</p>
        <p className="mt-5 text-xs text-white/40">© 2026 LaHotte — Tous droits réservés</p>
      </footer>
    </main>
  );
};

export default Home;
