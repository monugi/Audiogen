// Simplified voice selection logic to fix conversion errors
const getWorkingVoice = () => {
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;
  
  // Try to find a voice that matches the selected voice name
  if (voiceName) {
    const selectedVoice = voices.find(v => v.name === voiceName);
    if (selectedVoice) return selectedVoice;
  }
  
  // Fallback to first available voice
  return voices[0];
};

const createUtterance = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = getWorkingVoice();
  
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang || 'en-US';
  } else {
    utterance.lang = detectLanguage(text);
  }
  
  utterance.rate = Math.max(0.6, Math.min(1.2, rate));
  utterance.pitch = Math.max(0.8, Math.min(1.2, pitch));
  utterance.volume = Math.max(0.7, Math.min(1, volume));
  
  return utterance;
};
