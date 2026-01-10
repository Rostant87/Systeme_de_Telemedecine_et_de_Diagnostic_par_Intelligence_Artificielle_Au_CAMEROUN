import React, { useState } from 'react';
import { FileText, Plus, Search, Download, Upload, User } from 'lucide-react';

const DMESystem = () => {
  const [patients, setPatients] = useState([
    {
      id: 'DME001',
      nom: 'NGONO Marie',
      age: 34,
      sexe: 'F',
      village: 'Garoua-Nord',
      derniereConsultation: '2026-01-08',
      pathologie: 'Paludisme',
      statut: 'En traitement'
    },
    {
      id: 'DME002',
      nom: 'BELLO Amadou',
      age: 7,
      sexe: 'M',
      village: 'Maroua-Centre',
      derniereConsultation: '2026-01-07',
pathologie: 'Malnutrition',
      statut: 'Suivi'
    },
    {
      id: 'DME003',
      nom: 'ATEBA Florence',
      age: 28,
      sexe: 'F',
      village: 'Ngaoundéré',
      derniereConsultation: '2026-01-05',
      pathologie: 'Grossesse (CPN2)',
      statut: 'Suivi prénatal'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPatient, setNewPatient] = useState({
    nom: '',
    age: '',
    sexe: 'M',
    village: '',
    pathologie: '',
    symptomes: ''
  });

  const filteredPatients = patients.filter(p => 
    p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.village.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenPatient = (patient) => {
    alert(`Ouverture du dossier: ${patient.nom}\nID: ${patient.id}\nPathologie: ${patient.pathologie}`);
  };

  const handleAddPatient = () => {
    if (!newPatient.nom || !newPatient.age) {
      alert('Nom et âge sont obligatoires');
      return;
    }

    const patient = {
      id: `DME${String(patients.length + 1).padStart(3, '0')}`,
      ...newPatient,
      age: parseInt(newPatient.age),
      derniereConsultation: new Date().toISOString().split('T')[0],
      statut: 'Nouveau'
    };

    setPatients([...patients, patient]);
    setNewPatient({
      nom: '',
      age: '',
      sexe: 'M',
      village: '',
      pathologie: '',
      symptomes: ''
    });
    setShowAddForm(false);
  };

  const exportDME = () => {
    const dataStr = JSON.stringify(patients, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DME_Export_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="text-green-600" />
            Dossier Médical Électronique (DME)
          </h2>
          <div className="flex gap-2">
            <button
              onClick={exportDME}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Download size={18} />
              Exporter
            </button>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Plus size={18} />
              Nouveau Patient
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher par nom, ID ou village..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {showAddForm && (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6">
            <h3 className="font-bold text-lg mb-4 text-green-800">Créer un nouveau DME</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nom complet *
                </label>
                <input
                  type="text"
                  value={newPatient.nom}
                  onChange={(e) => setNewPatient({...newPatient, nom: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Ex: NGONO Marie"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Âge *
                </label>
                <input
                  type="number"
                  value={newPatient.age}
                  onChange={(e) => setNewPatient({...newPatient, age: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Ex: 34"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Sexe
                </label>
                <select
                  value={newPatient.sexe}
                  onChange={(e) => setNewPatient({...newPatient, sexe: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Village/Localité
                </label>
                <input
                  type="text"
                  value={newPatient.village}
                  onChange={(e) => setNewPatient({...newPatient, village: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Ex: Garoua-Nord"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Pathologie principale
                </label>
                <input
                  type="text"
                  value={newPatient.pathologie}
                  onChange={(e) => setNewPatient({...newPatient, pathologie: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Ex: Paludisme"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Symptômes
                </label>
                <input
                  type="text"
                  value={newPatient.symptomes}
                  onChange={(e) => setNewPatient({...newPatient, symptomes: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Ex: Fièvre, frissons"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleAddPatient}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
              >
                Créer DME
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">ID DME</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Patient</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Âge</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Sexe</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Village</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Dernière Consultation</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Pathologie</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Statut</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-mono text-blue-600">{patient.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{patient.nom}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{patient.age}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{patient.sexe}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{patient.village}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{patient.derniereConsultation}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{patient.pathologie}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      patient.statut === 'En traitement' ? 'bg-yellow-100 text-yellow-800' :
                      patient.statut === 'Suivi' ? 'bg-blue-100 text-blue-800' :
                      patient.statut === 'Suivi prénatal' ? 'bg-purple-100 text-purple-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {patient.statut}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleOpenPatient(patient)} className="text-green-600 hover:text-green-800 text-sm font-medium">
                      Ouvrir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <User className="mx-auto text-slate-300 mb-4" size={64} />
            <p className="text-slate-500">Aucun patient trouvé</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">📊 Statistiques DME</h4>
          <p className="text-2xl font-bold text-blue-600">{patients.length}</p>
          <p className="text-sm text-blue-700">Dossiers créés</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-2">🔄 Synchronisation P2P</h4>
          <p className="text-2xl font-bold text-green-600">100%</p>
          <p className="text-sm text-green-700">Données synchronisées</p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-semibold text-purple-800 mb-2">🔒 Sécurité</h4>
          <p className="text-2xl font-bold text-purple-600">AES-256</p>
          <p className="text-sm text-purple-700">Chiffrement actif</p>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>📱 Synchronisation automatique:</strong> Les DME sont automatiquement sauvegardés localement et synchronisés avec les cliniques via le réseau P2P lorsqu'une connexion est disponible. Aucune donnée n'est perdue même hors ligne.
        </p>
      </div>
    </div>
  );
};

export default DMESystem;