// Storage utilities for DME system
export const saveDMERecord = (record) => {
  const records = JSON.parse(localStorage.getItem('dmeRecords') || '[]')
  records.push({
    ...record,
    timestamp: new Date().toISOString()
  })
  localStorage.setItem('dmeRecords', JSON.stringify(records))
  return record
}

export const getDMERecords = () => {
  return JSON.parse(localStorage.getItem('dmeRecords') || '[]')
}

export const deleteDMERecord = (id) => {
  const records = JSON.parse(localStorage.getItem('dmeRecords') || '[]')
  const filtered = records.filter(r => r.id !== id)
  localStorage.setItem('dmeRecords', JSON.stringify(filtered))
}

export const savePatient = (patient) => {
  const patients = JSON.parse(localStorage.getItem('dmePatients') || '[]')
  const existing = patients.findIndex(p => p.id === patient.id)
  if (existing >= 0) {
    patients[existing] = patient
  } else {
    patients.push(patient)
  }
  localStorage.setItem('dmePatients', JSON.stringify(patients))
}

export const getPatients = () => {
  return JSON.parse(localStorage.getItem('dmePatients') || '[]')
}
