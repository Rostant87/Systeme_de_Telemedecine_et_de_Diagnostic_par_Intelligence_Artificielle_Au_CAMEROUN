// Système de stockage local IndexedDB (gratuit)
const DB_NAME = 'ASR_Telemedicine_DB';
const DB_VERSION = 1;

class LocalStorage {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains('patients')) {
          db.createObjectStore('patients', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('diagnostics')) {
          db.createObjectStore('diagnostics', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  async savePatient(patient) {
    const transaction = this.db.transaction(['patients'], 'readwrite');
    const store = transaction.objectStore('patients');
    return store.put(patient);
  }

  async getPatients() {
    const transaction = this.db.transaction(['patients'], 'readonly');
    const store = transaction.objectStore('patients');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveDiagnostic(diagnostic) {
    const transaction = this.db.transaction(['diagnostics'], 'readwrite');
    const store = transaction.objectStore('diagnostics');
    return store.add(diagnostic);
  }
}

export default new LocalStorage();
