import { useState, useEffect } from 'react'
import { Plus, Trash2, Eye } from 'lucide-react'

export default function DMESystem() {
  const [patients, setPatients] = useState([])
  const [newPatient, setNewPatient] = useState({
    nom: '',
    age: '',
    sexe: '',
    village: '',
    telephone: ''
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPatient, setSelectedPatient] = useState(null)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('dmePatients') || '[]')
    setPatients(saved)
  }, [])

  const addPatient = (e) => {
    e.preventDefault()
    if (!newPatient.nom || !newPatient.age) {
      alert('Veuillez remplir tous les champs')
      return
    }

    const patientRecord = {
      id: `DME${String(patients.length + 1).padStart(3, '0')}`,
      ...newPatient,
      dateCreation: new Date().toISOString(),
      status: 'Nouveau'
    }

    const updated = [...patients, patientRecord]
    setPatients(updated)
    localStorage.setItem('dmePatients', JSON.stringify(updated))
    
    setNewPatient({ nom: '', age: '', sexe: '', village: '', telephone: '' })
    alert('✅ Patient ajouté avec succès!')
  }

  const deletePatient = (id) => {
    if (!confirm('Confirmer la suppression?')) return
    const updated = patients.filter(p => p.id !== id)
    setPatients(updated)
    localStorage.setItem('dmePatients', JSON.stringify(updated))
  }

  const openPatient = (patient) => {
    setSelectedPatient(patient)
    alert(`📋 Patient: ${patient.nom}\nID: ${patient.id}\nAge: ${patient.age}\nVillage: ${patient.village}`)
  }

  const filtered = patients.filter(p =>
    p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.includes(searchTerm) ||
    p.village.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulaire d'ajout */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Nouveau patient</h3>
            <form onSubmit={addPatient} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nom</label>
                <input
                  type="text"
                  value={newPatient.nom}
                  onChange={(e) => setNewPatient({ ...newPatient, nom: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Nom complet"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Âge</label>
                <input
                  type="number"
                  value={newPatient.age}
                  onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Âge"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Sexe</label>
                <select
                  value={newPatient.sexe}
                  onChange={(e) => setNewPatient({ ...newPatient, sexe: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option>Sélectionner</option>
                  <option>M</option>
                  <option>F</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Village</label>
                <input
                  type="text"
                  value={newPatient.village}
                  onChange={(e) => setNewPatient({ ...newPatient, village: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Localité"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Téléphone</label>
                <input
                  type="tel"
                  value={newPatient.telephone}
                  onChange={(e) => setNewPatient({ ...newPatient, telephone: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Numéro"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 font-semibold flex items-center justify-center gap-2"
              >
                <Plus size={18} /> Ajouter
              </button>
            </form>
          </div>
        </div>

        {/* Liste des patients */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Dossiers médicaux ({patients.length})
            </h3>

            <input
              type="text"
              placeholder="Rechercher par nom, ID ou village..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
            />

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="text-left p-3">ID</th>
                    <th className="text-left p-3">Nom</th>
                    <th className="text-left p-3">Âge</th>
                    <th className="text-left p-3">Village</th>
                    <th className="text-left p-3">Statut</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center p-4 text-gray-500">
                        Aucun patient
                      </td>
                    </tr>
                  ) : (
                    filtered.map(patient => (
                      <tr key={patient.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-bold text-blue-600">{patient.id}</td>
                        <td className="p-3">{patient.nom}</td>
                        <td className="p-3">{patient.age}</td>
                        <td className="p-3">{patient.village}</td>
                        <td className="p-3">
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">
                            {patient.status}
                          </span>
                        </td>
                        <td className="p-3 flex gap-2">
                          <button
                            onClick={() => openPatient(patient)}
                            className="text-blue-500 hover:text-blue-700"
                            title="Voir"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => deletePatient(patient.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Supprimer"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
