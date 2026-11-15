import { Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const Snow = ({ className = '' }: { className?: string }) => (
  <span aria-hidden="true" className={`snowflake pointer-events-none absolute select-none ${className}`}>✳</span>
);

const GiftIllustration = () => (
  <div className="relative mx-auto h-[290px] w-full max-w-[390px]" aria-hidden="true">
    <div className="absolute bottom-5 left-1/2 h-40 w-64 -translate-x-1/2 rounded-[50%] bg-[#102d25]/45 blur-xl" />
    <div className="absolute bottom-10 left-[13%] h-32 w-28 rotate-[-7deg] rounded-md border border-[#e6c98e]/55 bg-[#9b3d42] shadow-[0_18px_30px_rgba(0,0,0,0.22)]">
      <div className="gift-ribbon absolute left-1/2 h-full w-5 -translate-x-1/2" />
      <div className="absolute -top-4 left-1/2 h-7 w-12 -translate-x-1/2 rounded-t-full border-[5px] border-b-0 border-[#d8bd82]" />
    </div>
    <div className="absolute bottom-10 right-[12%] h-28 w-32 rotate-[6deg] rounded-md border border-[#e6c98e]/55 bg-[#d2b77d] shadow-[0_18px_30px_rgba(0,0,0,0.2)]">
      <div className="absolute left-1/2 h-full w-5 -translate-x-1/2 bg-[#f0dfb8]" />
      <div className="absolute left-1/2 top-0 h-5 w-full -translate-x-1/2 bg-[#f0dfb8]" />
    </div>
    <div className="absolute bottom-[122px] left-1/2 h-36 w-32 -translate-x-1/2">
      <div className="absolute left-1/2 top-0 h-0 w-0 -translate-x-1/2 border-x-[17px] border-b-[42px] border-x-transparent border-b-[#55765a]" />
      <div className="absolute left-1/2 top-8 h-0 w-0 -translate-x-1/2 border-x-[31px] border-b-[55px] border-x-transparent border-b-[#315c43]" />
      <div className="absolute left-1/2 top-[54px] h-0 w-0 -translate-x-1/2 border-x-[46px] border-b-[66px] border-x-transparent border-b-[#244b39]" />
      <div className="absolute bottom-0 left-1/2 h-8 w-7 -translate-x-1/2 rounded-b-sm bg-[#9b6843]" />
      <span className="absolute left-[48%] top-5 h-2 w-2 rounded-full bg-[#f2d18b] shadow-[0_0_12px_4px_rgba(242,209,139,0.5)]" />
      <span className="absolute left-[28%] top-[66px] h-2 w-2 rounded-full bg-[#bd5550] shadow-[0_0_10px_3px_rgba(189,85,80,0.35)]" />
      <span className="absolute right-[25%] top-[84px] h-2 w-2 rounded-full bg-[#f2d18b] shadow-[0_0_12px_4px_rgba(242,209,139,0.5)]" />
      <span className="absolute left-[46%] top-[102px] h-2 w-2 rounded-full bg-[#e7dfc8]" />
      <span className="absolute left-1/2 top-[-9px] -translate-x-1/2 text-2xl text-[#f2d18b] drop-shadow-[0_0_10px_rgba(242,209,139,0.7)]">✦</span>
    </div>
    <span className="absolute left-[18%] top-8 text-2xl text-[#f0d69f]">✦</span>
    <span className="absolute right-[18%] top-14 text-lg text-[#f0d69f]">✧</span>
    <span className="absolute right-[8%] bottom-24 text-xl text-[#f0d69f]">✦</span>
    <span className="absolute left-[7%] bottom-24 text-sm text-white/70">✧</span>
  </div>
);

const Home = () => {
  const { user } = useAuth();

  return (
    <main className="christmas-page min-h-screen">
      <section className="christmas-hero relative isolate overflow-hidden text-white">
        <div className="christmas-lights absolute inset-x-0 top-0 h-9 opacity-90" aria-hidden="true" />
        <div className="absolute inset-0 -z-10 opacity-[0.13]" aria-hidden="true" style={{ backgroundImage: 'radial-gradient(ellipse at center, transparent 0%, #071e17 100%)' }} />
        <Snow className="left-[8%] top-24 text-xl" />
        <Snow className="left-[43%] top-16 text-xs" />
        <Snow className="right-[8%] top-28 text-2xl" />
        <Snow className="right-[38%] bottom-16 text-sm" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-5 px-5 pb-16 pt-20 sm:px-8 md:grid-cols-[1.05fr_0.95fr] md:pb-24 md:pt-24">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e7d3a5]/35 bg-white/[0.07] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f0d69f]">
              <span className="text-sm">✦</span> Noël se prépare ensemble
            </div>
            <h1 className="font-serif text-[2.65rem] font-medium leading-[1.08] tracking-tight text-[#fff8e9] sm:text-5xl md:text-[3.65rem]">
              La magie de Noël commence <span className="italic text-[#f0d69f]">dans la Hotte.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-[#f7f1e5]/80 sm:text-lg">
              Les envies de chacun, les idées de cadeaux et le plaisir d’offrir réunis au même endroit. Préparez les fêtes en famille, sans perdre la surprise.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              {user ? (
                <Link to="/familles" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#f1dfb8] px-6 py-3.5 text-sm font-bold text-[#193d31] shadow-[0_5px_18px_rgba(0,0,0,0.14)] hover:-translate-y-0.5 hover:bg-[#fff3d8] transition">
                  Retrouver ma famille <span aria-hidden="true">→</span>
                </Link>
              ) : (
                <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#f1dfb8] px-6 py-3.5 text-sm font-bold text-[#193d31] shadow-[0_5px_18px_rgba(0,0,0,0.14)] hover:-translate-y-0.5 hover:bg-[#fff3d8] transition">
                  Créer mon espace <span aria-hidden="true">→</span>
                </Link>
              )}
              <Link to={user ? "/cadeaux" : "/login"} className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10">
                {user ? 'Voir les cadeaux' : 'J’ai déjà un compte'}
              </Link>
            </div>
            <p className="mt-6 text-xs text-white/55">Une liste commune · Des surprises bien gardées · Le plaisir d’offrir</p>
          </div>
          <div className="relative mt-4 md:mt-0">
            <div className="absolute inset-x-[12%] bottom-8 top-8 rounded-full bg-[#d8b878]/10 blur-3xl" />
            <GiftIllustration />
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#fbf8f0]/15 to-transparent" />
      </section>

      <section className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9b7545]">La préparation des fêtes</p>
          <h2 className="mt-3 font-serif text-3xl font-medium text-[#244536] sm:text-4xl">Chacun glisse ses envies dans la Hotte.</h2>
          <p className="mt-4 text-base leading-7 text-[#667066]">Et tout le monde se retrouve autour du plaisir de faire plaisir.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icon: '⌂', number: '01', title: 'Réunissez la famille', description: 'Créez votre espace et retrouvez vos proches pour préparer les fêtes ensemble.' },
            { icon: '✧', number: '02', title: 'Glissez vos idées', description: 'Ajoutez vos envies de cadeaux et partagez facilement les détails utiles.' },
            { icon: '🎁', number: '03', title: 'Faites équipe', description: 'Participez aux cadeaux à plusieurs, tout en gardant la surprise pour chacun.' },
          ].map((item) => (
            <article key={item.number} className="christmas-card group relative overflow-hidden rounded-2xl p-7 transition duration-200 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(43,58,43,0.11)]">
              <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-[#e8eddf]/70 transition group-hover:bg-[#e0e9d9]" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e8eee4] font-serif text-2xl text-[#315a42]">{item.icon}</span>
                  <span className="font-serif text-2xl text-[#b99b66]">{item.number}</span>
                </div>
                <h3 className="mt-7 text-lg font-bold text-[#294735]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#69746a]">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-4 mb-16 overflow-hidden rounded-[26px] bg-[#e9eddf] sm:mx-8 md:mx-auto md:mb-20 md:max-w-7xl">
        <div className="grid gap-8 px-7 py-12 sm:px-10 md:grid-cols-[1fr_auto] md:items-center md:px-14 md:py-14">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9b7545]">La surprise avant tout</p>
            <h2 className="mt-3 max-w-2xl font-serif text-3xl font-medium leading-tight text-[#244536] sm:text-4xl">Les préparatifs restent secrets. La joie, elle, se partage.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#667066]">Les personnes qui organisent les cadeaux disposent des informations nécessaires. Les bénéficiaires ne voient ni qui participe ni les montants réunis pour leurs cadeaux.</p>
          </div>
          <div className="hidden h-28 w-28 items-center justify-center rounded-full border border-[#b7c5ad] bg-[#f8f7ef] text-5xl text-[#a33f43] md:flex" aria-hidden="true">✧</div>
        </div>
      </section>

      {!user && (
        <section className="mx-auto max-w-7xl px-5 pb-16 text-center sm:px-8 md:pb-20">
          <p className="text-2xl text-[#b28d55]" aria-hidden="true">✦　✧　✦</p>
          <h2 className="mt-3 font-serif text-3xl font-medium text-[#244536]">La Hotte n’attend plus que vous.</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#69746a]">Créez votre compte et commencez à préparer de belles surprises avec vos proches.</p>
          <Link to="/register" className="mt-7 inline-flex rounded-xl bg-[#214638] px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-[#17392f]">
            Rejoindre LaHotte
          </Link>
        </section>
      )}

      <footer className="relative overflow-hidden bg-[#193d31] px-5 py-10 text-center text-white sm:px-8">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,#a43e42,#d2b77d,#a43e42)]" />
        <p className="font-serif text-2xl tracking-wide text-[#fff8e9]">LaHotte</p>
        <p className="mt-2 text-sm text-[#e5d6b6]/75">Le plaisir d’offrir, ensemble.</p>
        <p className="mt-5 text-xs text-white/40">© 2026 LaHotte — Tous droits réservés</p>
      </footer>
    </main>
  );
};

export default Home;
