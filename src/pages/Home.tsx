import { Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <main className="overflow-hidden bg-[#fff8ef]">
      <section className="relative isolate overflow-hidden santa-hero text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 gold-sparkle">
          <div className="absolute -right-28 -top-32 h-[28rem] w-[28rem] rounded-full border border-white/10" />
          <div className="absolute -right-16 -top-20 h-[24rem] w-[24rem] rounded-full border border-white/10" />
          <div className="absolute left-[8%] top-16 text-2xl text-[#f4d78e]/70">✦</div>
          <div className="absolute left-[44%] top-28 text-sm text-white/50">✧</div>
          <div className="absolute right-[12%] top-24 text-xl text-[#f4d78e]/70">✦</div>
          <div className="absolute bottom-24 left-[16%] text-lg text-white/40">❄</div>
          <div className="absolute bottom-16 right-[42%] text-sm text-[#f4d78e]/60">✧</div>
          <div className="absolute inset-x-0 bottom-0 h-2 bg-[#c3263b]" />
          <div className="absolute inset-x-0 bottom-2 h-px gold-rule" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-16 sm:px-8 md:grid-cols-[1.05fr_0.95fr] md:pb-28 md:pt-24">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#f2d58d]/35 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#f6dda0]">
              <span className="text-base">✦</span> Noël se prépare en famille
            </div>
            <h1 className="font-serif text-[2.75rem] font-bold leading-[1.04] tracking-tight sm:text-6xl lg:text-[4.25rem]">
              Cette année,<br />
              <span className="gold-foil">la magie</span> se partage.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
              Les envies de chacun, les cadeaux tous ensemble et de belles surprises à préparer. LaHotte réunit toute la famille autour du plaisir d’offrir.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              {user ? (
                <Link to="/familles" className="inline-flex items-center justify-center gap-2 rounded-xl gold-cta px-6 py-3.5 text-sm font-extrabold text-[#50320d] transition hover:-translate-y-0.5 hover:bg-[#fff0c6]">
                  Voir mes familles <span aria-hidden="true">→</span>
                </Link>
              ) : (
                <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-xl gold-cta px-6 py-3.5 text-sm font-extrabold text-[#50320d] transition hover:-translate-y-0.5 hover:bg-[#ffe5a6]">
                  Créer mon espace <span aria-hidden="true">→</span>
                </Link>
              )}
              <Link to={user ? '/cadeaux' : '/login'} className="inline-flex items-center justify-center rounded-xl border border-white/35 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10">
                {user ? 'Voir les cadeaux' : 'J’ai déjà un compte'}
              </Link>
            </div>
            <p className="mt-6 text-xs font-medium tracking-wide text-white/55">Gratuit · Familial · Sans paiement en ligne</p>
          </div>

          <div className="relative mx-auto w-full max-w-[440px] pb-5 pt-3">
            <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-[#f2d58c]/10 blur-3xl" />
            <div className="relative gift-preview rounded-[2rem] p-5 sm:p-7">
              <div className="flex items-center justify-between border-b border-[#e8d9bb] pb-4">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#987642]">La liste de famille</p>
                  <p className="mt-1 font-serif text-xl font-bold text-[#174b36]">Les petits souhaits</p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8efdf] text-xl text-[#174b36]">✦</span>
              </div>

              <div className="space-y-3 py-5">
                <div className="gift-row flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f8e5df] text-2xl">🧸</div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[#294536]">Une jolie surprise</p>
                    <p className="mt-0.5 text-xs text-[#8c887d]">Une idée à glisser sous le sapin</p>
                  </div>
                  <span className="text-lg text-[#bd963f]">♡</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8eee4] text-2xl">📚</div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[#294536]">Un cadeau à plusieurs</p>
                    <p className="mt-0.5 text-xs text-[#8c887d]">Chacun apporte sa petite part</p>
                  </div>
                  <span className="text-lg text-[#bd963f]">♡</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f7edcf] text-2xl">🎁</div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[#294536]">La surprise est gardée</p>
                    <p className="mt-0.5 text-xs text-[#8c887d]">Jusqu’au grand jour…</p>
                  </div>
                  <span className="text-lg text-[#bd963f]">♡</span>
                </div>
              </div>

              <div className="rounded-xl bg-[#174b36] px-4 py-3 text-center text-xs font-bold tracking-wide text-[#f7dfa0]">
                ✨ Le bonheur d’offrir, tous ensemble ✨
              </div>
            </div>
            <div aria-hidden="true" className="absolute -bottom-1 -left-3 -rotate-12 rounded-xl bg-[#d32640] px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg sm:-left-8">
              Ho ho ho !
            </div>
            <div aria-hidden="true" className="absolute -right-2 top-8 rotate-12 rounded-full border-2 border-[#f3d48c] bg-[#b9273b] px-3 py-3 text-xl shadow-lg sm:-right-5">
              ✦
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20">
        <div className="mx-auto mb-11 max-w-2xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#b27c36]">La recette d’un Noël bien organisé</p>
          <h2 className="mt-3 font-serif text-3xl font-bold text-[#174b36] sm:text-4xl">Trois petits pas, et la magie opère.</h2>
          <p className="mt-4 text-base leading-7 text-[#77766d]">Plus besoin de courir après les idées ou de s’échanger mille messages.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icon: '🏡', number: '01', title: 'Rassemblez la famille', description: 'Créez votre espace et invitez vos proches à préparer les fêtes au même endroit.', tint: 'bg-[#e9f0e5]' },
            { icon: '🎁', number: '02', title: 'Glissez vos envies', description: 'Ajoutez vos idées cadeaux, avec les photos, les prix et les liens utiles.', tint: 'bg-[#f8e8df]' },
            { icon: '💝', number: '03', title: 'Offrez à plusieurs', description: 'Participez aux cadeaux de vos proches et gardez la surprise jusqu’au bout.', tint: 'bg-[#f7efd8]' },
          ].map((item) => (
            <article key={item.number} className="group rounded-3xl border border-[#eee1cc] bg-white p-7 shadow-[0_8px_25px_rgba(60,45,25,0.045)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(60,45,25,0.1)]">
              <div className="flex items-center justify-between">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-3xl ${item.tint}`}>{item.icon}</div>
                <span className="font-serif text-2xl font-bold text-[#d9c7a4]">{item.number}</span>
              </div>
              <h3 className="mt-6 font-serif text-xl font-bold text-[#174b36]">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#77766d]">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#f4eadb]">
        <div aria-hidden="true" className="absolute -right-10 -top-16 text-[12rem] leading-none text-[#e6d7bd]/50">✳</div>
        <div className="relative mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 md:grid-cols-[0.8fr_1.2fr] md:items-center md:py-20">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#b27c36]">Chut… c’est une surprise !</p>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-[#174b36] sm:text-4xl">Les cadeaux se préparent. La surprise reste entière.</h2>
          </div>
          <div className="rounded-2xl border border-[#e3d4b9] bg-[#fffaf1]/80 p-6 sm:p-8">
            <p className="text-base leading-7 text-[#68685f]">
              Chacun peut consulter les listes et participer aux cadeaux. Les détails des contributions restent réservés aux personnes qui ont besoin de les organiser : le bénéficiaire, lui, garde toute la surprise.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-[#174b36]">
              <span className="rounded-full bg-[#e8efe4] px-3 py-2">Organisation simple</span>
              <span className="rounded-full bg-[#f8e5df] px-3 py-2">Surprises préservées</span>
              <span className="rounded-full bg-[#f6edcf] px-3 py-2">En famille</span>
            </div>
          </div>
        </div>
      </section>

      {!user && (
        <section className="px-5 py-16 sm:px-8 md:py-20">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-[#b9273b] px-6 py-12 text-center text-white shadow-[0_18px_45px_rgba(125,32,42,0.2)] sm:px-12">
            <div aria-hidden="true" className="absolute -left-12 -top-16 h-48 w-48 rounded-full border border-white/15" />
            <div aria-hidden="true" className="absolute -bottom-24 -right-8 h-64 w-64 rounded-full border border-white/15" />
            <div className="relative">
              <p className="text-2xl">✦ ✧ ✦</p>
              <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">On prépare Noël ensemble ?</h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/85 sm:text-base">Créez votre compte gratuitement et commencez à réunir les envies de toute la famille.</p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link to="/register" className="rounded-xl gold-cta px-6 py-3.5 text-sm font-extrabold text-[#50320d] shadow-sm transition hover:bg-[#ffe5a6]">Créer mon compte</Link>
                <Link to="/login" className="rounded-xl border border-white/50 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10">J’ai déjà un compte</Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <footer className="bg-[#123b2b] px-5 py-9 text-center text-white sm:px-8">
        <p className="font-serif text-2xl font-bold">LaHotte <span className="text-[#e9c879]">✦</span></p>
        <p className="mt-2 text-sm text-white/65">Le plaisir d’offrir, la magie de partager.</p>
        <p className="mt-5 text-xs text-white/40">© 2026 LaHotte — Tous droits réservés</p>
      </footer>
    </main>
  );
};

export default Home;
