// Replace the getBestVoiceForText function with a simpler, more reliable one
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
