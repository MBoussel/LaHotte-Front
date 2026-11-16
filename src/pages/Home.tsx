import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const [biscuitPoints, setBiscuitPoints] = useState(() => {
    try { return Number(localStorage.getItem('lahotte-biscuit-clicker-score')) || 0; } catch { return 0; }
  });
  const [biscuitMove, setBiscuitMove] = useState(0);
  useEffect(() => {
    try { localStorage.setItem('lahotte-biscuit-clicker-score', String(biscuitPoints)); } catch { /* stockage local indisponible */ }
  }, [biscuitPoints]);
  const biscuitOffsets = [{x:-24,y:-12},{x:24,y:-18},{x:34,y:18},{x:-30,y:24},{x:8,y:-28},{x:-8,y:30}];
  const currentBiscuitOffset = biscuitOffsets[biscuitMove % biscuitOffsets.length];
  const clickBiscuit = () => { setBiscuitPoints(points => points + 1); setBiscuitMove(move => move + 1); };

  return (
    <main className="home-page overflow-hidden">
      <div className="desktop-sparkles" aria-hidden="true" />
      <section className="home-hero relative isolate overflow-hidden text-white">
        <div className="hero-glow hero-glow-red" />
        <div className="hero-glow hero-glow-gold" />
        <div className="hero-glow hero-glow-green" />
        <div className="hero-stars" aria-hidden="true" />
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 md:py-24 lg:py-28">
          <div className="max-w-2xl">
            <div className="hero-eyebrow mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[.2em]">
              <span className="text-lg">✦</span> La magie de Noël se partage
            </div>
            <h1 className="home-hero-title font-serif text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Les plus beaux cadeaux sont <span className="gold-shimmer">ceux qu’on partage</span> <span className="hero-santa" role="img" aria-label="Père Noël">🎅</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/80 sm:text-lg">
              Réunissez les envies de toute la famille, préparez les surprises ensemble et participez aux cadeaux de ceux que vous aimez.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link to={user ? '/familles' : '/register'} className="hero-primary inline-flex items-center justify-center gap-3 rounded-2xl px-7 py-4 font-extrabold">
                {user ? 'Voir mes familles' : 'Créer mon espace'} <span aria-hidden="true">→</span>
              </Link>
              <Link to={user ? '/cadeaux' : '/login'} className="hero-secondary inline-flex items-center justify-center rounded-2xl px-7 py-4 font-bold">
                {user ? 'Voir les cadeaux' : 'J’ai déjà un compte'}
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/70">
              <span>✧ Gratuit</span><span>✧ Familial</span><span>✧ Sans paiement en ligne</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[470px]">
            <div className="gift-orbit gift-orbit-one" />
            <div className="gift-orbit gift-orbit-two" />
            <div className="gift-stage relative mx-auto max-w-[390px] rounded-[2rem] p-5 sm:p-7">
              <div className="mb-6 flex items-center justify-between">
                <div><p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-900/55">LaHotte familiale</p><h2 className="mt-1 font-serif text-2xl font-bold text-[#173c2d]">La liste des envies</h2></div>
                <span className="gift-stage-icon"><img src="https://cdn-icons-png.flaticon.com/512/9004/9004908.png" alt="Joyeux Noël" loading="lazy" /></span>
              </div>
              <div className="gift-item gift-item-product">
                <div className="gift-product-image"><img src="https://store.sony.co.nz/dw/image/v2/ABBC_PRD/on/demandware.static/-/Sites-sony-master-catalog/default/dw1b537bbb/images/PLAYSTATION5W/PLAYSTATION5W.png" alt="Console PlayStation 5 et manette" loading="lazy" /></div>
                <div className="min-w-0 flex-1"><p className="font-bold text-[#20392d]">Console PlayStation 5</p><p className="text-xs text-[#65746a]">Le cadeau qui fait rêver</p></div>
                <span className="gift-price">650 €</span>
              </div>
              <div className="gift-item gift-item-product">
                <div className="gift-product-image"><img src="https://media.idkids.fr/media/productstorage/images/oxybuleveiletjeux/0710194/thumbs/0602739_800.jpg" alt="Trottinette Globber Primo à trois roues vert menthe" loading="lazy" /></div>
                <div className="min-w-0 flex-1"><p className="font-bold text-[#20392d]">Trottinette Globber</p><p className="text-xs text-[#65746a]">Pour partir à l’aventure</p></div>
                <span className="gift-price">90 €</span>
              </div>
              <div className="gift-item gift-item-product">
                <div className="gift-product-image"><img src="https://www.nike.com.kw/dw/image/v2/BDVB_PRD/on/demandware.static/-/Sites-akeneo-master-catalog/default/dw6ffcb2b0/nk/03a/e/1/f/a/1/03ae1fa1_b497_4d21_92ac_ccdf7cb8cbe9.jpg" alt="Baskets Nike noires et blanches" loading="lazy" /></div>
                <div className="min-w-0 flex-1"><p className="font-bold text-[#20392d]">Baskets Nike</p><p className="text-xs text-[#65746a]">Un classique à offrir</p></div>
                <span className="gift-price">110 €</span>
              </div>
              <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#174b36] px-4 py-3 text-white shadow-lg">
                <div><p className="text-xs text-white/70">Ensemble, c’est plus simple</p><p className="font-bold">Un Noël bien préparé</p></div><img className="prepared-christmas-icon" src="https://cdn-icons-png.flaticon.com/512/13368/13368731.png" alt="Père Noël" loading="lazy" />
              </div>
            </div>
            <div className="floating-gift floating-gift-top"><img src="https://cdn-icons-png.flaticon.com/512/9204/9204869.png" alt="Père Noël" loading="lazy" /></div>
            <div className="gingerbread-clicker" style={{ marginLeft: currentBiscuitOffset.x, marginTop: currentBiscuitOffset.y }}>
              <span className="gingerbread-score" aria-live="polite">{biscuitPoints} <span>pts</span></span>
              <button type="button" className="floating-gift floating-gift-bottom gingerbread-launcher" onClick={clickBiscuit} aria-label={`Cliquer sur le biscuit : ${biscuitPoints} points`} title="Attrape le biscuit !"><img src="https://cdn-icons-png.flaticon.com/512/8732/8732463.png" alt="" loading="lazy" /></button>
            </div>
          </div>
        </div>
        <div className="hero-bottom-line" />
      </section>

      <section className="home-section relative px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="section-kicker">Tout simplement</p>
            <h2 className="section-heading mt-3">La magie opère à plusieurs</h2>
            <p className="section-copy mt-4">Tout ce qu’il faut pour organiser les cadeaux de famille, sans perdre la surprise.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <article className="feature-card"><span className="feature-icon feature-icon-red family-icon"><img src="https://cdn-icons-png.flaticon.com/512/2061/2061474.png" alt="Icône famille" loading="lazy" /></span><h3>Réunissez vos proches</h3><p>Créez votre famille et invitez chacun à rejoindre l’aventure de Noël.</p><span className="feature-number">01</span></article>
            <article className="feature-card"><span className="feature-icon feature-icon-green gift-feature-icon"><img src="https://cdn-icons-png.flaticon.com/512/3656/3656962.png" alt="Cadeau surprise" loading="lazy" /></span><h3>Partagez vos envies</h3><p>Ajoutez vos idées cadeaux avec photos, prix et liens pour guider vos proches.</p><span className="feature-number">02</span></article>
            <article className="feature-card"><span className="feature-icon feature-icon-gold">💝</span><h3>Participez ensemble</h3><p>Chacun peut contribuer aux cadeaux. Les détails restent confidentiels.</p><span className="feature-number">03</span></article>
          </div>
        </div>
      </section>

      <section className="home-story relative overflow-hidden px-5 py-20 sm:px-8 lg:py-24">
        <div className="story-light story-light-one" /><div className="story-light story-light-two" />
        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[.9fr_1.1fr]">
          <div><p className="section-kicker section-kicker-light">L’esprit de LaHotte</p><h2 className="mt-3 font-serif text-4xl font-bold leading-tight text-white sm:text-5xl">Gardez la surprise. Partagez le plaisir.</h2><p className="mt-5 max-w-lg leading-8 text-white/70">Les contributions sont pensées pour préserver la surprise du bénéficiaire. Le Père Noël garde la vue d’ensemble pour organiser les cadeaux sereinement.</p></div>
          <div className="story-points">
            <div><span>01</span><div><h3>Les envies de chacun</h3><p>Une liste claire, facile à consulter par toute la famille.</p></div></div>
            <div><span>02</span><div><h3>Les contributions discrètes</h3><p>Les montants et les participants ne sont pas affichés à tout le monde.</p></div></div>
            <div><span>03</span><div><h3>Un Noël sans casse-tête</h3><p>Tout est réuni au même endroit pour mieux s’organiser.</p></div></div>
          </div>
        </div>
      </section>

      {!user && <section className="home-cta-wrap px-5 py-20 sm:px-8"><div className="home-cta mx-auto max-w-5xl rounded-[2rem] px-6 py-12 text-center sm:px-12"><img src="https://cdn-icons-png.flaticon.com/512/3912/3912870.png" alt="Boule à neige" loading="lazy" className="mx-auto h-14 w-14 object-contain drop-shadow-lg" /><h2 className="mt-4 font-serif text-3xl font-bold sm:text-4xl">Et si cette année, on préparait Noël ensemble ?</h2><p className="mx-auto mt-4 max-w-2xl leading-7">Créez votre espace gratuitement et partagez la magie avec ceux qui comptent.</p><Link to="/register" className="hero-primary mt-8 inline-flex rounded-2xl px-7 py-4 font-extrabold">Créer mon compte <span className="ml-2">→</span></Link></div></section>}

      <footer className="home-footer px-5 py-10 text-center"><p className="inline-flex items-center justify-center gap-2 font-serif text-2xl font-bold"><img src="https://cdn-icons-png.flaticon.com/512/2276/2276457.png" alt="" aria-hidden="true" className="h-7 w-7 object-contain" />LaHotte</p><p className="mt-2 text-sm">La magie de Noël se partage.</p><p className="mt-5 text-xs opacity-50">© 2026 LaHotte · Tous droits réservés</p></footer>
    </main>
  );
};

export default Home;
