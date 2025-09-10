// Fix for voice selection issue
const getSelectedVoice = () => {
  if (!voiceName) return null;
  
  // First try to find in system voices
  const systemVoice = systemVoices.find(v => v.name === voiceName);
  if (systemVoice) {
    return {
      name: systemVoice.name,
      value: systemVoice.name,
      language: systemVoice.lang,
      voice: systemVoice,
      isSystem: true
    };
  }
  
  // Then try to find in available voices
  const availableVoice = availableVoices.find(v => v.value === voiceName);
  if (availableVoice) {
    return availableVoice;
  }
  
  // Fallback to first system voice
  if (systemVoices.length > 0) {
    return {
      name: systemVoices[0].name,
      value: systemVoices[0].name,
      language: systemVoices[0].lang,
      voice: systemVoices[0],
      isSystem: true
    };
  }
  
  return null;
};
