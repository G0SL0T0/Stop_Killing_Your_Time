const natural = require('natural');
const classifier = new natural.BayesClassifier();

// Тренировка модели
classifier.addDocument('искусственный интеллект', 'технологии');
classifier.addDocument('нейросети', 'технологии');
classifier.addDocument('квантовая физика', 'наука');
classifier.addDocument('космос', 'наука');
classifier.train();

module.exports = (text) => {
  return classifier.classify(text) || 'другое';
};