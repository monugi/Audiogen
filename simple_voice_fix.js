// Simple fix for voice selection to prevent conversion errors
const getSimpleVoice = () => {
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;
  
  // Try to find the selected voice
  if (voiceName) {
    const selected = voices.find(v => v.name === voiceName);
    if (selected) return selected;
  }
  
  // Fallback to first available voice
  return voices[0];
};

const createSimpleUtterance = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = getSimpleVoice();
  
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang || 'en-US';
  }
  
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = volume;
  
  return utterance;
};
