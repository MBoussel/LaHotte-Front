import type { Membre } from '../../types';

interface MembresSectionProps {
  membres?: Membre[];
}

const MembresSection = ({ membres }: MembresSectionProps) => {
  return (
    <div className="card mb-8">
      <h2 className="text-xl font-bold mb-4">Membres de la famille</h2>
      <div className="flex flex-wrap gap-3">
        {membres?.map((membre) => (
          <div
            key={membre.id}
            className="bg-gray-100 px-4 py-2 rounded-full flex items-center gap-2"
          >
            <span className="font-semibold">{membre.username}</span>
            <span className="text-gray-500 text-sm">{membre.email}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembresSection;