// Enhanced voice system restoration
const VOICE_CATEGORIES = {
  all: 'All Voices',
  english: 'English',
  american: 'American English',
  british: 'British English',
  australian: 'Australian English',
  canadian: 'Canadian English',
  indian: 'Indian English',
  other: 'Other Languages',
  premium: 'Premium Quality'
};

const ENHANCED_VOICES = {
  // American English Voices
  american: [
    { name: 'Alex (Male)', value: 'Alex', language: 'en-US', gender: 'male', quality: 'high', accent: 'American', description: 'Deep, professional male voice' },
    { name: 'Samantha (Female)', value: 'Samantha', language: 'en-US', gender: 'female', quality: 'high', accent: 'American', description: 'Clear, friendly female voice' },
    { name: 'Daniel (Male)', value: 'Daniel', language: 'en-US', gender: 'male', quality: 'high', accent: 'American', description: 'Warm, conversational male voice' },
    { name: 'Susan (Female)', value: 'Susan', language: 'en-US', gender: 'female', quality: 'high', accent: 'American', description: 'Professional, articulate female voice' },
    { name: 'Tom (Male)', value: 'Tom', language: 'en-US', gender: 'male', quality: 'medium', accent: 'American', description: 'Casual, approachable male voice' },
    { name: 'Victoria (Female)', value: 'Victoria', language: 'en-US', gender: 'female', quality: 'high', accent: 'American', description: 'Elegant, sophisticated female voice' },
  ],
  
  // British English Voices
  british: [
    { name: 'Daniel (British)', value: 'Daniel', language: 'en-GB', gender: 'male', quality: 'high', accent: 'British', description: 'Refined British male voice' },
    { name: 'Kate (Female)', value: 'Kate', language: 'en-GB', gender: 'female', quality: 'high', accent: 'British', description: 'Polished British female voice' },
    { name: 'Oliver (Male)', value: 'Oliver', language: 'en-GB', gender: 'male', quality: 'high', accent: 'British', description: 'Distinguished British male voice' },
    { name: 'Serena (Female)', value: 'Serena', language: 'en-GB', gender: 'female', quality: 'high', accent: 'British', description: 'Sophisticated British female voice' },
  ],
  
  // Australian English Voices
  australian: [
    { name: 'Karen (Female)', value: 'Karen', language: 'en-AU', gender: 'female', quality: 'high', accent: 'Australian', description: 'Friendly Australian female voice' },
    { name: 'Lee (Male)', value: 'Lee', language: 'en-AU', gender: 'male', quality: 'high', accent: 'Australian', description: 'Relaxed Australian male voice' },
    { name: 'Tessa (Female)', value: 'Tessa', language: 'en-AU', gender: 'female', quality: 'high', accent: 'Australian', description: 'Energetic Australian female voice' },
  ],
  
  // Canadian English Voices
  canadian: [
    { name: 'Gordon (Male)', value: 'Gordon', language: 'en-CA', gender: 'male', quality: 'high', accent: 'Canadian', description: 'Warm Canadian male voice' },
    { name: 'Moira (Female)', value: 'Moira', language: 'en-CA', gender: 'female', quality: 'high', accent: 'Canadian', description: 'Clear Canadian female voice' },
  ],
  
  // Indian English Voices
  indian: [
    { name: 'Lekha (Female)', value: 'Lekha', language: 'hi-IN', gender: 'female', quality: 'high', accent: 'Indian', description: 'Melodious Indian female voice' },
    { name: 'Ravi (Male)', value: 'Ravi', language: 'hi-IN', gender: 'male', quality: 'high', accent: 'Indian', description: 'Rich Indian male voice' },
    { name: 'Priya (Female)', value: 'Priya', language: 'hi-IN', gender: 'female', quality: 'high', accent: 'Indian', description: 'Gentle Indian female voice' },
  ],
  
  // Other Languages
  other: [
    { name: 'Amélie (French)', value: 'Amélie', language: 'fr-FR', gender: 'female', quality: 'high', accent: 'French', description: 'Elegant French female voice' },
    { name: 'Pierre (French)', value: 'Pierre', language: 'fr-FR', gender: 'male', quality: 'high', accent: 'French', description: 'Sophisticated French male voice' },
    { name: 'María (Spanish)', value: 'María', language: 'es-ES', gender: 'female', quality: 'high', accent: 'Spanish', description: 'Passionate Spanish female voice' },
    { name: 'Diego (Spanish)', value: 'Diego', language: 'es-ES', gender: 'male', quality: 'high', accent: 'Spanish', description: 'Charismatic Spanish male voice' },
    { name: 'Anna (German)', value: 'Anna', language: 'de-DE', gender: 'female', quality: 'high', accent: 'German', description: 'Precise German female voice' },
    { name: 'Hans (German)', value: 'Hans', language: 'de-DE', gender: 'male', quality: 'high', accent: 'German', description: 'Authoritative German male voice' },
    { name: 'Yuki (Japanese)', value: 'Yuki', language: 'ja-JP', gender: 'female', quality: 'high', accent: 'Japanese', description: 'Gentle Japanese female voice' },
    { name: 'Takeshi (Japanese)', value: 'Takeshi', language: 'ja-JP', gender: 'male', quality: 'high', accent: 'Japanese', description: 'Respectful Japanese male voice' },
    { name: 'Xiaoli (Chinese)', value: 'Xiaoli', language: 'zh-CN', gender: 'female', quality: 'high', accent: 'Chinese', description: 'Melodious Chinese female voice' },
    { name: 'Wei (Chinese)', value: 'Wei', language: 'zh-CN', gender: 'male', quality: 'high', accent: 'Chinese', description: 'Confident Chinese male voice' },
  ],
  
  // Premium Quality Voices
  premium: [
    { name: 'Aria (Premium Female)', value: 'Aria', language: 'en-US', gender: 'female', quality: 'premium', accent: 'American', description: 'Ultra-realistic premium female voice' },
    { name: 'Atlas (Premium Male)', value: 'Atlas', language: 'en-US', gender: 'male', quality: 'premium', accent: 'American', description: 'Ultra-realistic premium male voice' },
    { name: 'Nova (Premium Female)', value: 'Nova', language: 'en-GB', gender: 'female', quality: 'premium', accent: 'British', description: 'Ultra-realistic premium British female voice' },
    { name: 'Phoenix (Premium Male)', value: 'Phoenix', language: 'en-GB', gender: 'male', quality: 'premium', accent: 'British', description: 'Ultra-realistic premium British male voice' },
  ]
};
