import { useState, useEffect } from 'react';
import { cadeauxAPI, contributionsAPI } from '../services/api';
import type { Cadeau, ContributionWithUser } from '../types';

export const useCadeaux = (familleId: number | undefined, userId: number | undefined, creatorId?: number, pereNoelId?: number | null) => {
  const [cadeaux, setCadeaux] = useState<Cadeau[]>([]);
  const [contributions, setContributions] = useState<Record<number, ContributionWithUser[]>>({});

  useEffect(() => {
    if (familleId) loadCadeaux();
  }, [familleId, userId, creatorId, pereNoelId]);

  const loadCadeaux = async () => {
    if (!familleId) return;
    try {
      const response = await cadeauxAPI.getByFamille(familleId);
      setCadeaux(response.data);

      const contribsData: Record<number, ContributionWithUser[]> = {};
      await Promise.all(response.data.map(async (cadeau: Cadeau) => {
        const canSee =
          (userId === pereNoelId && cadeau.owner_id !== pereNoelId) ||
          (userId === creatorId && pereNoelId != null && cadeau.owner_id === pereNoelId);

        if (canSee && cadeau.owner_id !== userId) {
          try {
            const contribRes = await contributionsAPI.getForCadeau(cadeau.id);
            contribsData[cadeau.id] = contribRes.data;
          } catch {
            contribsData[cadeau.id] = [];
          }
        } else {
          contribsData[cadeau.id] = [];
        }
      }));
      setContributions(contribsData);
    } catch (error) {
      console.error('Erreur chargement cadeaux:', error);
    }
  };

  const createCadeau = async (data: Partial<Cadeau>) => {
    await cadeauxAPI.create(data);
    await loadCadeaux();
  };

  return { cadeaux, contributions, createCadeau, reload: loadCadeaux };
};
