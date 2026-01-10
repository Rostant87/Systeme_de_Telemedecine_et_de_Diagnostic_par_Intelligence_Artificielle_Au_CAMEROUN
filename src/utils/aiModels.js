import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

class AIModels {
  constructor() {
    this.mobileNetModel = null;
  }

  async loadMobileNet() {
    if (!this.mobileNetModel) {
      console.log('Chargement du modèle MobileNet...');
      this.mobileNetModel = await mobilenet.load();
      console.log('Modèle chargé avec succès');
    }
    return this.mobileNetModel;
  }

  async classifyImage(imageElement) {
    const model = await this.loadMobileNet();
    const predictions = await model.classify(imageElement);
    return predictions;
  }

  medicalInterpretation(predictions) {
    // Mapper les prédictions génériques vers des interprétations médicales
    const medicalKeywords = {
      'stethoscope': 'Équipement médical détecté',
      'syringe': 'Instrument médical',
      'bandage': 'Pansement/bandage',
      'pill bottle': 'Médicaments',
      'X-ray': 'Radiographie',
      'thermometer': 'Thermomètre'
    };

    return predictions.map(pred => {
      const medicalTerm = medicalKeywords[pred.className] || pred.className;
      return {
        ...pred,
        medicalInterpretation: medicalTerm
      };
    });
  }
}

export default new AIModels();
