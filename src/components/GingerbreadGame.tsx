import { useEffect, useState } from 'react';

type SaveData = {
  points: number;
  clicks: number;
  multiplier: number;
  upgradeCost: number;
};

const SAVE_KEY = 'lahotte-biscuit-clicker-v1';
const DEFAULT_SAVE: SaveData = { points: 0, clicks: 0, multiplier: 1, upgradeCost: 25 };

function readSave(): SaveData {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return DEFAULT_SAVE;
    const saved = JSON.parse(raw) as Partial<SaveData>;
    return {
      points: Math.max(0, Number(saved.points) || 0),
      clicks: Math.max(0, Number(saved.clicks) || 0),
      multiplier: Math.max(1, Number(saved.multiplier) || 1),
      upgradeCost: Math.max(25, Number(saved.upgradeCost) || 25),
    };
  } catch {
    return DEFAULT_SAVE;
  }
}

type Props = { onClose: () => void };

export default function GingerbreadGame({ onClose }: Props) {
  const [save, setSave] = useState<SaveData>(readSave);
  const [pop, setPop] = useState(0);

  useEffect(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  }, [save]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  const clickBiscuit = () => {
    setSave(current => ({
      ...current,
      points: current.points + current.multiplier,
      clicks: current.clicks + 1,
    }));
    setPop(value => value + 1);
  };

  const buyUpgrade = () => {
    setSave(current => {
      if (current.points < current.upgradeCost) return current;
      return {
        ...current,
        points: current.points - current.upgradeCost,
        multiplier: current.multiplier + 1,
        upgradeCost: Math.ceil(current.upgradeCost * 1.7),
      };
    });
  };

  const milestones = [
    { target: 10, label: 'Premier goûter', detail: '10 clics' },
    { target: 50, label: 'Petit gourmand', detail: '50 clics' },
    { target: 100, label: 'Maître biscuitier', detail: '100 clics' },
    { target: 500, label: 'Légende de Noël', detail: '500 clics' },
  ];
  const nextMilestone = milestones.find(item => save.clicks < item.target);

  return (
    <div className="ginger-game-backdrop" onClick={onClose} role="presentation">
      <section className="ginger-game-panel" role="dialog" aria-modal="true" aria-labelledby="ginger-game-title" onClick={event => event.stopPropagation()}>
        <button type="button" className="ginger-game-close" onClick={onClose} aria-label="Fermer le jeu">×</button>
        <p className="ginger-game-kicker">La pause gourmande de LaHotte</p>
        <h2 id="ginger-game-title">Le Biscuit Clicker</h2>
        <p className="ginger-game-subtitle">Clique sur le bonhomme et récolte des douceurs de Noël !</p>

        <div className="ginger-game-score">
          <span>Ton stock de douceurs</span>
          <strong>{save.points.toLocaleString('fr-FR')}</strong>
          <small>points</small>
        </div>

        <button type="button" className="ginger-game-biscuit" onClick={clickBiscuit} aria-label={`Cliquer sur le biscuit pour gagner ${save.multiplier} points`}>
          <img src="https://cdn-icons-png.flaticon.com/512/8732/8732463.png" alt="" />
          <span key={pop} className="ginger-game-plus">+{save.multiplier}</span>
        </button>
        <p className="ginger-game-hint">Clique encore ! Chaque clic rapporte {save.multiplier} point{save.multiplier > 1 ? 's' : ''}.</p>

        <div className="ginger-game-stats">
          <div><strong>{save.clicks.toLocaleString('fr-FR')}</strong><span>clics</span></div>
          <div><strong>×{save.multiplier}</strong><span>par clic</span></div>
        </div>

        <div className="ginger-game-upgrade">
          <div><strong>Recette secrète</strong><span>Ajoute +1 point à chaque clic</span></div>
          <button type="button" onClick={buyUpgrade} disabled={save.points < save.upgradeCost}>
            {save.upgradeCost.toLocaleString('fr-FR')} points
          </button>
        </div>

        <div className="ginger-game-progress">
          <div className="ginger-game-progress-heading">
            <strong>Défis du biscuit</strong>
            <span>{nextMilestone ? `${save.clicks} / ${nextMilestone.target}` : 'Tous les défis terminés !'}</span>
          </div>
          {nextMilestone ? (
            <>
              <div className="ginger-game-progress-track"><span style={{ width: `${Math.min(100, (save.clicks / nextMilestone.target) * 100)}%` }} /></div>
              <p>Prochain succès : <strong>{nextMilestone.label}</strong> ({nextMilestone.detail})</p>
            </>
          ) : <p>Tu es devenu une légende de Noël !</p>}
        </div>
        <p className="ginger-game-save-note">Ton score est conservé sur cet appareil.</p>
      </section>
    </div>
  );
}
