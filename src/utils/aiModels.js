// AI Models utilities
export const loadMobileNetModel = async () => {
  try {
    const mobilenet = await import('@tensorflow-models/mobilenet')
    return await mobilenet.load()
  } catch (error) {
    console.error('Erreur lors du chargement du modèle MobileNet:', error)
    throw error
  }
}

export const classifyImage = async (imageElement, model) => {
  try {
    const predictions = await model.classify(imageElement)
    return predictions
  } catch (error) {
    console.error('Erreur lors de la classification:', error)
    throw error
  }
}
