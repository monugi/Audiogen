import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Volume2,
  Play,
  Pause,
  Download,
  Settings,
  Star,
  Zap,
  Shield,
  Globe,
  Menu,
  X,
  Mic,
  Type,
  Headphones,
  Users,
  Clock,
  Award,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Code,
  Smartphone,
  BookOpen,
  BarChart3,
  MessageCircle,
  ArrowRight,
  Quote,
  DollarSign,
  Target,
  Lightbulb,
  Heart,
  TrendingUp,
} from 'lucide-react';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voiceName, setVoiceName] = useState('');
  const [rate, setRate] = useState(0.95);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [openFaq, setOpenFaq] = useState(null);
  
  const utteranceRef = useRef(null);
  const queueRef = useRef([]);
  const audioRef = useRef(typeof Audio !== 'undefined' ? new Audio() : null);
  const [lastWavUrl, setLastWavUrl] = useState(null);
              const LANGUAGE_VOICES = {
    english: [
      { name: 'Lekha', value: 'Lekha', language: 'hi-IN' },
      { name: 'Samantha', value: 'Samantha', language: 'en-US' },
      { name: 'Karen', value: 'Karen', language: 'en-AU' },
    ],
    hindi: [
      { name: 'Lekha', value: 'Lekha', language: 'hi-IN' },
      { name: 'Samantha', value: 'Samantha', language: 'en-US' },
      { name: 'Karen', value: 'Karen', language: 'en-AU' },
    ],
  };

        

  const CURATED_INDIAN = [
    { name: 'Lekha', value: 'Lekha' },
    { name: 'Samantha', value: 'Samantha' },
    { name: 'Karen', value: 'Karen' },
  ];
  const BANNED_NAMES = [];
  const [availableVoices, setAvailableVoices] = useState(CURATED_INDIAN);
  const [systemVoices, setSystemVoices] = useState([]);

  // Bilingual voice mapping: each model uses itself for English and Lekha for Hindi
  const BILINGUAL_VOICE_MAP = {
    Lekha: { en: 'Samantha', hi: 'Lekha' },
    Samantha: { en: 'Samantha', hi: 'Lekha' },
    Karen: { en: 'Karen', hi: 'Lekha' },
  };

  const detectHindiScript = (s) => /[\u0900-\u097F]/.test(s);

  // Load system voices when available (browsers populate asynchronously)
  React.useEffect(() => {
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    if (!synth) return;
    const load = () => {
      try {
        const v = synth.getVoices();
        if (v && v.length) setSystemVoices(v);
      } catch {}
    };
    // Some browsers need an initial call and the event
    load();
    if ('onvoiceschanged' in synth) {
      synth.onvoiceschanged = load;
    } else {
      // Fallback: poll briefly until voices appear
      let tries = 0;
      const id = setInterval(() => {
        tries++;
        load();
        if (systemVoices.length || tries > 20) clearInterval(id);
      }, 200);
      return () => clearInterval(id);
    }
    return () => {
      try { synth.onvoiceschanged = null; } catch {}
    };
  }, []);

  const pickVoiceByLang = (voices, opts) => {
    const { preferredName, langPrefix } = opts;
    // Try preferred name first
    if (preferredName) {
      const byName = voices.find((v) => v.name === preferredName);
      if (byName) return byName;
    }
    // Exact region match
    const exact = voices.find((v) => (v.lang || '').toLowerCase() === `${langPrefix}-in`);
    if (exact) return exact;
    // Any matching prefix
    const byPrefix = voices.find((v) => (v.lang || '').toLowerCase().startsWith(`${langPrefix}`));
    if (byPrefix) return byPrefix;
    // As a last resort, return the first voice
    return voices[0];
  };

  const pickBilingualVoice = (voices, sentence, selectedName) => {
    const isHindi = detectHindiScript(sentence);
    if (isHindi) {
      return pickVoiceByLang(voices, { preferredName: 'Lekha', langPrefix: 'hi' });
    }
    // English: prefer the selected voice if available, otherwise any English voice
    const selected = voices.find((v) => v.name === selectedName);
    if (selected && /en/i.test(selected.lang || '')) return selected;
    return pickVoiceByLang(voices, { preferredName: selectedName, langPrefix: 'en' });
  };

  // Only use curated voices - no Web Speech voices
  React.useEffect(() => {
    setAvailableVoices(CURATED_INDIAN);
    if (!voiceName && CURATED_INDIAN.length) {
      setVoiceName(CURATED_INDIAN[0].value);
    }
  }, []);
  const speak = async () => {
    if (!text.trim() || !('speechSynthesis' in window)) return;

    // Resume if paused
    if (isPaused) {
      try { window.speechSynthesis.resume(); } catch {}
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    // Toggle pause if already speaking
    if (isPlaying) {
      try { window.speechSynthesis.pause(); } catch {}
      setIsPaused(true);
      setIsPlaying(false);
      return;
    }

    setIsConverting(true);

    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      queueRef.current = [];

      // Split text into manageable sentences for better prosody
      const sentences = text
        .replace(/\s+/g, ' ')
        .split(/(?<=[.!?\u0964\u0965])\s+/)
        .filter((s) => s && s.trim().length > 0);

      const voices = window.speechSynthesis.getVoices();
      const voicesList = (systemVoices && systemVoices.length) ? systemVoices : voices;

      const makeUtter = (s) => {
        const isHindi = detectHindiScript(s);
        const preferred = pickBilingualVoice(voicesList, s, voiceName);
        const u = new SpeechSynthesisUtterance(s);
        u.rate = Math.max(0.6, Math.min(1.2, rate));
        u.pitch = Math.max(0.8, Math.min(1.2, pitch));
        u.volume = Math.max(0.7, Math.min(1, volume));
        if (preferred) u.voice = preferred;
        u.lang = isHindi ? 'hi-IN' : (preferred && preferred.lang) ? preferred.lang : 'en-US';
        return u;
      };

      // Queue utterances with small pauses via setTimeout between chunks
      let index = 0;
      const speakNext = () => {
        if (index >= sentences.length) {
          setIsPlaying(false);
          setIsPaused(false);
          setIsConverting(false);
          return;
        }
        const u = makeUtter(sentences[index]);
        utteranceRef.current = u;
        u.onend = () => {
          index += 1;
          setTimeout(speakNext, 120);
        };
        u.onerror = () => {
          index += 1;
          setTimeout(speakNext, 120);
        };
        window.speechSynthesis.speak(u);
      };

      speakNext();
      setIsPlaying(true);
      setIsPaused(false);
    } catch (e) {
      console.error(e);
      setIsPlaying(false);
      setIsPaused(false);
      setIsConverting(false);
    } finally {
      // keep spinner until onend/onerror completes
    }
  };

  const wavFromPCM = (float32Pcm, sampleRate) => {
    const clamp = (n) => Math.max(-1, Math.min(1, n));
    const pcm16 = new Int16Array(float32Pcm.length);
    for (let i = 0; i < float32Pcm.length; i++) pcm16[i] = (clamp(float32Pcm[i]) * 0x7fff) | 0;
    const bytesPerSample = 2;
    const blockAlign = 1 * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const wavBuffer = new ArrayBuffer(44 + pcm16.byteLength);
    const view = new DataView(wavBuffer);
    let offset = 0;
    const writeString = (s) => { for (let i = 0; i < s.length; i++) view.setUint8(offset++, s.charCodeAt(i)); };
    const writeUint32 = (v) => { view.setUint32(offset, v, true); offset += 4; };
    const writeUint16 = (v) => { view.setUint16(offset, v, true); offset += 2; };

    writeString('RIFF');
    writeUint32(36 + pcm16.byteLength);
    writeString('WAVE');
    writeString('fmt ');
    writeUint32(16);
    writeUint16(1);
    writeUint16(1);
    writeUint32(sampleRate);
    writeUint32(byteRate);
    writeUint16(blockAlign);
    writeUint16(16);
    writeString('data');
    writeUint32(pcm16.byteLength);
    new Uint8Array(wavBuffer, 44).set(new Uint8Array(pcm16.buffer));
    return new Blob([wavBuffer], { type: 'audio/wav' });
  };

  const pickEffectiveVoiceId = (inputText, selectedVoiceId) => {
    // Devanagari (Hindi): U+0900–U+097F
    const hasHindi = /[\u0900-\u097F]/.test(inputText);
    if (hasHindi) return 'mac:Lekha';
    // Tamil: U+0B80–U+0BFF
    const hasTamil = /[\u0B80-\u0BFF]/.test(inputText);
    if (hasTamil) return 'mac:Vani';
    return selectedVoiceId || 'mac:Lekha';
  };

  const convert = async () => {
    if (!text.trim()) return;
    setIsConverting(true);
    try {
      const sentences = text
        .replace(/\s+/g, ' ')
        .split(/(?<=[.!?\u0964\u0965])\s+/)
        .filter((s) => s && s.trim().length > 0);

      const voices = speechSynthesis.getVoices();
      const voicesList = (systemVoices && systemVoices.length) ? systemVoices : voices;

      const speakSequence = (parts) => {
        let i = 0;
        const next = () => {
          if (i >= parts.length) {
            setIsConverting(false);
            return;
          }
          const s = parts[i];
          const isHindi = detectHindiScript(s);
          const v = pickBilingualVoice(voicesList, s, voiceName);
          const utter = new SpeechSynthesisUtterance(s);
          utter.lang = isHindi ? 'hi-IN' : (v && v.lang) ? v.lang : 'en-US';
          utter.rate = rate;
          utter.pitch = pitch;
          utter.volume = volume;
          if (v) utter.voice = v;
          utter.onend = () => { i += 1; setTimeout(next, 120); };
          utter.onerror = () => { i += 1; setTimeout(next, 120); };
          speechSynthesis.speak(utter);
        };
        next();
      };

      speechSynthesis.cancel();
      speakSequence(sentences.length ? sentences : [text]);
    } catch (e) {
      alert('Conversion failed. Please try again in a supported browser.');
      setIsConverting(false);
    }
  };

  const playLast = async () => {
    if (!lastWavUrl || !audioRef.current) return;
    try {
      audioRef.current.src = lastWavUrl;
      audioRef.current.volume = volume;
      await audioRef.current.play();
      setIsPlaying(true);
      setIsPaused(false);
      audioRef.current.onended = () => { setIsPlaying(false); setIsPaused(false); };
    } catch {}
  };

  const stop = () => {
    try { if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; } } catch {}
    queueRef.current = [];
    setIsPlaying(false);
    setIsPaused(false);
  };

  const downloadAudio = async () => {
    alert('Download is not available without a local model or backend. Playback still works.');
  };

  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Lightning Fast',
      description: 'Convert text to speech in milliseconds with our optimized engine',
    },
    {
      icon: <Headphones className="h-8 w-8" />,
      title: 'High Quality',
      description: 'Crystal clear audio output with multiple voice options',
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: 'Multi-Language',
      description: 'Support for multiple languages and accents',
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Privacy First',
      description: 'Your text is processed locally, never sent to servers',
    },
  ];

  const stats = [
    { number: '1M+', label: 'Texts Converted', icon: <Type className="h-6 w-6" /> },
    { number: '50K+', label: 'Happy Users', icon: <Users className="h-6 w-6" /> },
    { number: '99.9%', label: 'Uptime', icon: <Clock className="h-6 w-6" /> },
    { number: '25+', label: 'Languages', icon: <Globe className="h-6 w-6" /> },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Content Creator',
      avatar: 'SJ',
      content:
        'AudioGen has revolutionized my content creation process. The voice quality is incredible and saves me hours of recording time.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'E-learning Developer',
      avatar: 'MC',
      content:
        'Perfect for creating educational content. The multiple voice options help me create engaging lessons for different audiences.',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Accessibility Specialist',
      avatar: 'ER',
      content:
        'This tool has been a game-changer for making content accessible. The natural-sounding voices make a huge difference.',
      rating: 5,
    },
  ];

  const useCases = [
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: 'E-Learning',
      description:
        'Create engaging educational content with natural-sounding narration for online courses and tutorials.',
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: 'Mobile Apps',
      description:
        'Integrate text-to-speech functionality into your mobile applications for better user experience.',
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: 'Accessibility',
      description:
        'Make your content accessible to visually impaired users with high-quality audio narration.',
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: 'API Integration',
      description:
        'Use our powerful API to add text-to-speech capabilities to your existing applications.',
    },
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        'Up to 1,000 characters per conversion',
        '3 voice options',
        'Basic speed control',
        'Standard quality audio',
      ],
      popular: false,
    },
    {
      name: 'Pro',
      price: '$19',
      period: 'per month',
      features: [
        'Unlimited character conversions',
        '15+ premium voices',
        'Advanced voice controls',
        'High-quality audio export',
        'API access',
        'Priority support',
      ],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      features: [
        'Everything in Pro',
        'Custom voice training',
        'White-label solution',
        'Dedicated support',
        'SLA guarantee',
        'Custom integrations',
      ],
      popular: false,
    },
  ];

  const faqs = [
    {
      question: 'How accurate is the text-to-speech conversion?',
      answer:
        'Our AI-powered engine provides 99.9% accuracy with natural-sounding voices that closely mimic human speech patterns.',
    },
    {
      question: 'Can I use AudioGen for commercial purposes?',
      answer:
        'Yes! Our Pro and Enterprise plans include commercial usage rights. Check our pricing page for details.',
    },
    {
      question: 'What file formats do you support for audio export?',
      answer:
        'We support MP3, WAV, and M4A formats with various quality settings to suit your needs.',
    },
    {
      question: 'Is my text data secure and private?',
      answer:
        'Absolutely. We process all text locally and never store your content on our servers. Your privacy is our priority.',
    },
    {
      question: 'Do you offer API access?',
      answer:
        'Yes! Our Pro and Enterprise plans include comprehensive API access with detailed documentation and SDKs.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* PURPLE GRADIENT HEADER SECTION */}
      <header className="bg-gradient-to-r from-purple-600 via-[#6A54FE] to-purple-700 shadow-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 shadow-lg">
                <Volume2 className="h-7 w-7 text-white" />
              </div>
              <span className="text-3xl font-bold text-white">AudioGen</span>
            </motion.div>

            <nav className="hidden space-x-8 md:flex">
              {['Home', 'Features', 'Pricing', 'About'].map((item) => (
                <a
                  key={item}
                  href={item === 'Home' ? '#home' : item === 'Features' ? '#features' : item === 'Pricing' ? '#pricing' : '#about'}
                  className="font-medium text-white/90 transition-colors hover:text-white"
                >
                  {item}
                </a>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <button className="hidden rounded-full border border-white/30 bg-white/20 px-6 py-2 font-medium text-white backdrop-blur-sm transition-all hover:bg-white/30 md:block">
                Sign In
              </button>
              <button className="transform rounded-full bg-white px-6 py-2 font-medium text-[#6A54FE] shadow-lg transition-all hover:scale-105 hover:bg-purple-50">
                Get Started
              </button>
              <button className="text-white md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* TWO-COLUMN HERO SECTION */}
      <section id="home" className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-purple-50 px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-80 w-80 animate-pulse rounded-full bg-gradient-to-br from-purple-200/30 to-[#6A54FE]/20"></div>
          <div className="absolute -left-40 top-1/2 h-96 w-96 animate-bounce rounded-full bg-gradient-to-br from-purple-300/20 to-purple-400/30"></div>
          <div className="absolute bottom-0 right-1/4 h-64 w-64 animate-pulse rounded-full bg-gradient-to-br from-[#6A54FE]/20 to-purple-300/30"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* LEFT COLUMN - TEXT CONTENT */}
            <motion.div
              className="text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-8">
                <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
                  Transform Text to
                  <span className="block bg-gradient-to-r from-purple-600 via-[#6A54FE] to-purple-700 bg-clip-text text-transparent">
                    {' '}
                    Speech
                  </span>
                </h1>
                <p className="mb-8 text-lg leading-relaxed text-gray-600 sm:text-xl md:text-2xl">
                  Convert any text into natural-sounding speech with our advanced AI-powered
                  text-to-speech technology. Perfect for content creators, educators, and
                  accessibility needs.
                </p>
              </div>

              {/* Key Features List */}
              <div className="mb-8 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-[#6A54FE]">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium text-gray-700">Lightning-fast conversion</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-[#6A54FE]">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium text-gray-700">High-quality natural voices</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-[#6A54FE]">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium text-gray-700">Multiple language support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-[#6A54FE]">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium text-gray-700">100% privacy & secure</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <button className="transform rounded-full bg-gradient-to-r from-purple-600 via-[#6A54FE] to-purple-700 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:from-purple-700 hover:via-purple-600 hover:to-purple-800 hover:shadow-xl">
                  Try It Free Now
                </button>
                <button className="rounded-full border-2 border-purple-300 px-8 py-4 text-lg font-semibold text-gray-700 transition-all hover:bg-purple-50">
                  Watch Demo
                </button>
              </div>
            </motion.div>

            {/* RIGHT COLUMN - CONVERTER FUNCTIONALITY */}
            <motion.div
              className="hover:shadow-3xl rounded-3xl border border-purple-200 bg-white/90 p-6 shadow-2xl backdrop-blur-sm transition-all duration-300 md:p-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="mb-6 text-center">
                <h3 className="mb-2 text-2xl font-bold text-gray-900">Try AudioGen Now</h3>
                <p className="text-gray-600">Enter your text and hear it come to life</p>
              </div>

              <div className="space-y-6">
                <div className="text-left">
                  <label className="mb-3 block text-lg font-medium text-gray-700">
                    Enter your text
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type or paste your text here... (Maximum 5000 characters)"
                    className="h-32 w-full resize-none rounded-xl border border-gray-300 bg-white p-4 text-gray-900 placeholder-gray-500 shadow-sm focus:border-[#6A54FE] focus:outline-none focus:ring-4 focus:ring-purple-300 sm:h-40"
                    maxLength={5000}
                  />
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-gray-500">{text.length}/5000 characters</span>
                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-purple-50 hover:text-[#6A54FE]"
                    >
                      <Settings className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Settings Panel */}
                {/* Enhanced Settings Panel */}
                {showSettings && (
                  <motion.div
                    className="space-y-8 rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 via-white to-purple-50 p-8 shadow-xl backdrop-blur-sm"
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <div className="mb-6 flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-[#6A54FE] shadow-lg">
                        <Settings className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">Voice Settings</h3>
                    </div>

                    <div className="space-y-8">

                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                      {/* Voice Selection */}
                      <div className="space-y-4">
                        <label className="block flex items-center space-x-2 text-lg font-semibold text-gray-700">
                          <Mic className="h-5 w-5 text-[#6A54FE]" />
                          <span>Voice Selection</span>
                        </label>
                        <div className="relative">
                          <select
                            value={voiceName}
                            onChange={(e) => setVoiceName(e.target.value)}
                            className="w-full cursor-pointer appearance-none rounded-xl border-2 border-purple-200 bg-white p-4 text-gray-900 shadow-lg transition-all duration-300 hover:shadow-xl focus:border-[#6A54FE] focus:outline-none focus:ring-4 focus:ring-purple-300"
                          >
                            {availableVoices.length > 0
                              ? availableVoices.map((v) => (
                                  <option key={v.value} value={v.value}>
                                    {v.name}
                                  </option>
                                ))
                              : [<option key="default" value="en_US-hfc_female-medium">en_US-hfc_female-medium</option>]}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                            <ChevronDown className="h-5 w-5 text-[#6A54FE]" />
                          </div>
                        </div>
                      </div>

                      {/* Speed Control */}
                      <div className="space-y-4">
                        <label className="block flex items-center space-x-2 text-lg font-semibold text-gray-700">
                          <Zap className="h-5 w-5 text-[#6A54FE]" />
                          <span>Speed: {rate}x</span>
                        </label>
                        <div className="relative">
                          <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={rate}
                            onChange={(e) => setRate(Math.max(0.5, Math.min(2, parseFloat(e.target.value))))}
                            className="slider h-3 w-full cursor-pointer appearance-none rounded-lg bg-gradient-to-r from-purple-200 to-[#6A54FE]"
                            style={{
                              background: `linear-gradient(to right, #a855f7 0%, #6A54FE ${((rate - 0.5) / 1.5) * 100}%, #e5e7eb ${((rate - 0.5) / 1.5) * 100}%, #e5e7eb 100%)`,
                            }}
                          />
                          <div className="mt-2 flex justify-between text-sm text-gray-500">
                            <span>Slow</span>
                            <span>Fast</span>
                          </div>
                        </div>
                      </div>

                      {/* Pitch Control */}
                      <div className="space-y-4">
                        <label className="block flex items-center space-x-2 text-lg font-semibold text-gray-700">
                          <Volume2 className="h-5 w-5 text-[#6A54FE]" />
                          <span>Pitch: {pitch}</span>
                        </label>
                        <div className="relative">
                          <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={pitch}
                            onChange={(e) => setPitch(Math.max(0.5, Math.min(2, parseFloat(e.target.value))))}
                            className="slider h-3 w-full cursor-pointer appearance-none rounded-lg bg-gradient-to-r from-purple-200 to-[#6A54FE]"
                            style={{
                              background: `linear-gradient(to right, #a855f7 0%, #6A54FE ${((pitch - 0.5) / 1.5) * 100}%, #e5e7eb ${((pitch - 0.5) / 1.5) * 100}%, #e5e7eb 100%)`,
                            }}
                          />
                          <div className="mt-2 flex justify-between text-sm text-gray-500">
                            <span>Low</span>
                            <span>High</span>
                          </div>
                        </div>
                      </div>

                      {/* Volume Control */}
                      <div className="space-y-4">
                        <label className="block flex items-center space-x-2 text-lg font-semibold text-gray-700">
                          <Headphones className="h-5 w-5 text-[#6A54FE]" />
                          <span>Volume: {Math.round(volume * 100)}%</span>
                        </label>
                        <div className="relative">
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={volume}
                            onChange={(e) => setVolume(Math.max(0, Math.min(1, parseFloat(e.target.value))))}
                            className="slider h-3 w-full cursor-pointer appearance-none rounded-lg bg-gradient-to-r from-purple-200 to-[#6A54FE]"
                            style={{
                              background: `linear-gradient(to right, #a855f7 0%, #6A54FE ${volume * 100}%, #e5e7eb ${volume * 100}%, #e5e7eb 100%)`,
                            }}
                          />
                          <div className="mt-2 flex justify-between text-sm text-gray-500">
                            <span>Mute</span>
                            <span>Max</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Presets */}
                    <div className="border-t border-purple-200 pt-6">
                      <h4 className="mb-4 flex items-center space-x-2 text-lg font-semibold text-gray-700">
                        <Star className="h-5 w-5 text-[#6A54FE]" />
                        <span>Quick Presets</span>
                      </h4>
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        <button
                          onClick={() => {
                            setRate(1);
                            setPitch(1);
                            setVolume(0.8);
                          }}
                          className="transform rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 p-3 transition-all duration-300 hover:scale-105 hover:from-blue-100 hover:to-blue-200"
                        >
                          <div className="text-center">
                            <div className="text-sm font-semibold text-blue-600">Normal</div>
                            <div className="text-xs text-blue-500">1x, 1.0, 80%</div>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            setRate(1.2);
                            setPitch(1.1);
                            setVolume(0.9);
                          }}
                          className="transform rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-green-100 p-3 transition-all duration-300 hover:scale-105 hover:from-green-100 hover:to-green-200"
                        >
                          <div className="text-center">
                            <div className="text-sm font-semibold text-green-600">Energetic</div>
                            <div className="text-xs text-green-500">1.2x, 1.1, 90%</div>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            setRate(0.9);
                            setPitch(1.0);
                            setVolume(1);
                          }}
                          className="transform rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100 p-3 transition-all duration-300 hover:scale-105 hover:from-purple-100 hover:to-purple-200"
                        >
                          <div className="text-center">
                            <div className="text-sm font-semibold text-purple-600">Clarity</div>
                            <div className="text-xs text-purple-500">0.9x, 1.0, 100%</div>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            setRate(1.5);
                            setPitch(1.3);
                            setVolume(1);
                          }}
                          className="transform rounded-xl border border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100 p-3 transition-all duration-300 hover:scale-105 hover:from-orange-100 hover:to-orange-200"
                        >
                          <div className="text-center">
                            <div className="text-sm font-semibold text-orange-600">Dynamic</div>
                            <div className="text-xs text-orange-500">1.5x, 1.3, 100%</div>
                          </div>
                        </button>
                      </div>
                    </div>

                  </motion.div>
                )}
                {/* Control Buttons */}
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <button
                    onClick={convert}
                    disabled={!text.trim() || isConverting}
                    className="flex transform items_center justify-center space-x-2 rounded-full bg-gradient-to-r from-purple-600 via-[#6A54FE] to-purple-700 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:from-purple-700 hover:via-purple-600 hover:to-purple-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                    data-testid="btn-convert"
                  >
                    {isConverting ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                    <span>{isConverting ? 'Converting...' : 'Convert'}</span>
                  </button>

                  <button
                    onClick={playLast}
                    disabled={!lastWavUrl}
                    className="flex transform items-center justify-center space-x-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:from-blue-700 hover:to-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                    data-testid="btn-play"
                  >
                    <Play className="h-5 w-5" />
                    <span>Play</span>
                  </button>

                  <button
                    onClick={downloadAudio}
                    disabled={!text.trim()}
                    className="flex transform items-center justify-center space-x-2 rounded-full bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:from-green-700 hover:to-green-800 disabled:cursor-not-allowed disabled:opacity-50"
                    data-testid="btn-download"
                  >
                    <Download className="h-5 w-5" />
                    <span>Download</span>
                  </button>

                  {(isPlaying || isPaused) && (
                    <button
                      onClick={stop}
                      className="flex transform items-center justify-center space-x-2 rounded-full bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:from-red-700 hover:to-red-800"
                    >
                      <X className="h-5 w-5" />
                      <span>Stop</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ENHANCED STATS SECTION WITH PURPLE GRADIENT BOXES */}
      <section className="bg-gradient-to-r from-purple-100 via-white to-purple-100 px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="transform rounded-2xl bg-gradient-to-r from-purple-600 via-[#6A54FE] to-purple-700 p-6 text-center shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl md:p-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="mb-3 flex justify-center text-white">{stat.icon}</div>
                <div className="mb-2 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                  {stat.number}
                </div>
                <div className="text-sm leading-relaxed text-white/90 md:text-base">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW FEATURES SECTION */}
      <section id="features" className="bg-white px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="mb-12 text-center md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">Features</h2>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600">
              Powerful capabilities designed to help you convert text into natural, expressive speech.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: <Zap className="h-8 w-8" />, title: 'Real‑time Playback', description: 'Hear your text instantly with low latency playback.' },
              { icon: <Headphones className="h-8 w-8" />, title: 'Voice Controls', description: 'Fine‑tune rate, pitch, and volume to match your style.' },
              { icon: <Globe className="h-8 w-8" />, title: 'Multi‑language', description: 'Switch seamlessly between supported languages and accents.' },
              { icon: <Shield className="h-8 w-8" />, title: 'Local & Private', description: 'Processing happens in‑browser for maximum privacy.' },
              { icon: <Settings className="h-8 w-8" />, title: 'Presets', description: 'One‑click presets to instantly set the right voice profile.' },
              { icon: <Download className="h-8 w-8" />, title: 'Export Ready', description: 'Prepare audio for export when a backend is connected.' },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                className="rounded-2xl border border-purple-200 bg-gradient-to-br from-white to-purple-50/40 p-6 transition-all duration-300 hover:border-[#6A54FE] hover:shadow-xl md:p-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <div className="mb-4 text-[#6A54FE]">{f.icon}</div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">{f.title}</h3>
                <p className="leading-relaxed text-gray-600">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ENHANCED FEATURES SECTION WITH IMPROVED SPACING */}
      <section id="why-choose" className="bg-gradient-to-br from-white via-purple-50/30 to-white px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="mb-16 text-center md:mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl md:text-6xl">
              Why Choose AudioGen?
            </h2>
            <p className="mx-auto max-w-4xl text-lg leading-relaxed text-gray-600 sm:text-xl">
              Experience the future of text-to-speech technology with our cutting-edge features
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="transform rounded-2xl border border-purple-200 bg-gradient-to-br from-white to-purple-50/50 p-6 transition-all duration-300 hover:scale-105 hover:border-[#6A54FE] hover:shadow-xl md:p-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="mb-4 text-[#6A54FE]">{feature.icon}</div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="leading-relaxed text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ENHANCED USE CASES SECTION WITH IMPROVED SPACING */}
      <section className="bg-gradient-to-r from-purple-50 via-white to-purple-50 px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="mb-16 text-center md:mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl md:text-6xl">
              Perfect For Every Use Case
            </h2>
            <p className="mx-auto max-w-4xl text-lg leading-relaxed text-gray-600 sm:text-xl">
              Discover how AudioGen can transform your content across different industries and
              applications
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                className="transform rounded-2xl border border-purple-200 bg-gradient-to-br from-white to-purple-50/30 p-6 transition-all duration-300 hover:scale-105 hover:border-[#6A54FE] hover:shadow-xl md:p-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="mb-4 text-[#6A54FE]">{useCase.icon}</div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">{useCase.title}</h3>
                <p className="leading-relaxed text-gray-600">{useCase.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ENHANCED TESTIMONIALS SECTION WITH IMPROVED SPACING */}
      <section className="bg-gradient-to-br from-white via-purple-50/20 to-white px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="mb-16 text-center md:mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl md:text-6xl">
              What Our Users Say
            </h2>
            <p className="mx-auto max-w-4xl text-lg leading-relaxed text-gray-600 sm:text-xl">
              Join thousands of satisfied users who trust AudioGen for their text-to-speech needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="rounded-2xl border border-purple-200 bg-gradient-to-br from-white to-purple-50/40 p-6 transition-all duration-300 hover:shadow-xl md:p-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="mb-6 flex items-center">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-[#6A54FE] font-bold text-white shadow-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text_gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="mb-4 flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                  ))}
                </div>
                <p className="italic leading-relaxed text-gray-700">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ENHANCED PRICING SECTION WITH IMPROVED SPACING */}
      <section id="pricing" className="bg-gradient-to-r from-purple-100 via-white to-purple-100 px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="mb-16 text-center md:mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl md:text-6xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mx-auto max-w-4xl text-lg leading-relaxed text-gray-600 sm:text-xl">
              Choose the perfect plan for your needs. No hidden fees, no surprises.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                className={`rounded-2xl border bg-gradient-to-br from-white to-purple-50/30 p-6 md:p-8 ${
                  plan.popular
                    ? 'border-[#6A54FE] shadow-2xl ring-4 ring-[#6A54FE]/20'
                    : 'border-purple-200'
                } relative transition-all duration-300 hover:shadow-xl`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                    <span className="rounded-full bg-gradient-to-r from-purple-500 to-[#6A54FE] px-4 py-1 text-sm font-semibold text-white shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-8 text-center">
                  <h3 className="mb-2 text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="ml-2 text-gray-600">{plan.period}</span>
                  </div>
                </div>
                <ul className="mb-8 space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <CheckCircle className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                      <span className="leading-relaxed text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full transform rounded-full px-6 py-3 font-semibold transition-all hover:scale-105 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 via-[#6A54FE] to-purple-700 text-white shadow-lg hover:from-purple-700 hover:via-purple-600 hover:to-purple-800'
                      : 'border border-gray-300 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 hover:from-gray-200 hover:to-gray-300'
                  }`}
                >
                  {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ENHANCED FAQ SECTION WITH IMPROVED SPACING */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-100 via-purple-50 to-purple-100 px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-60 w-60 animate-pulse rounded-full bg-gradient-to-br from-[#6A54FE]/20 to-purple-300/30"></div>
          <div className="absolute -left-20 top-1/2 h-80 w-80 animate-bounce rounded-full bg-gradient-to-br from-purple-200/30 to-[#6A54FE]/20"></div>
          <div className="absolute bottom-0 right-1/3 h-40 w-40 animate-pulse rounded-full bg-gradient-to-br from-purple-300/20 to-purple-400/30"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-5xl">
          <motion.div
            className="mb-16 text-center md:mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl md:text-6xl">
              Frequently Asked Questions
            </h2>
            <p className="text-lg leading-relaxed text-gray-600 sm:text-xl">
              Everything you need to know about AudioGen
            </p>
          </motion.div>

          <div className="space-y-4 md:space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="overflow-hidden rounded-2xl border border-purple-200 bg-gradient-to-r from-white via-purple-50/50 to-white transition-all duration-300 hover:border-[#6A54FE] hover:shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <button
                  className="group flex w-full items-center justify-between px-6 py-6 text-left transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100/50 md:px-8"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="pr-4 text-base font-semibold leading-relaxed text-gray-900 transition-colors group-hover:text-[#6A54FE] md:text-lg">
                    {faq.question}
                  </span>
                  <div className="flex-shrink-0">
                    {openFaq === index ? (
                      <ChevronUp className="h-5 w-5 text-[#6A54FE] transition-colors group-hover:text-purple-700 md:h-6 md:w-6" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500 transition-colors group-hover:text-[#6A54FE] md:h-6 md:w-6" />
                    )}
                  </div>
                </button>
                {openFaq === index && (
                  <motion.div
                    className="border-t border-purple-200 bg-gradient-to-r from-purple-50/30 to-white px-6 pb-6 md:px-8"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="pt-4 text-base leading-relaxed text-gray-600">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ENHANCED CTA SECTION WITH IMPROVED SPACING */}
      <section className="bg-gradient-to-r from-purple-100 via-white to-purple-100 px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl md:text-6xl">
              Ready to Transform Your Text?
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-gray-600 sm:text-xl">
              Join thousands of users who trust AudioGen for their text-to-speech needs
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <button className="transform rounded-full bg-gradient-to-r from-purple-600 via-[#6A54FE] to-purple-700 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:from-purple-700 hover:via-purple-600 hover:to-purple-800 hover:shadow-xl">
                Start Converting Now
              </button>
              <button className="rounded-full border-2 border-purple-300 px-8 py-4 text-lg font-semibold text-gray-700 transition-all hover:bg-purple-50">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PURPLE GRADIENT FOOTER SECTION WITH IMPROVED SPACING */}
      <footer id="about" className="bg-gradient-to-r from-purple-600 via-[#6A54FE] to-purple-700 px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="mb-6 flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 shadow-lg">
                  <Volume2 className="h-6 w-6 text-white" />
                </div>
                <span className="text-3xl font-bold text-white">AudioGen</span>
              </div>
              <p className="mb-6 max-w-md leading-relaxed text-white/80">
                The most advanced text-to-speech converter that brings your words to life with
                natural, high-quality audio output.
              </p>
              <div className="flex space-x-4">
                <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/20 transition-colors hover:bg-white/30">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/20 transition-colors hover:bg-white/30">
                  <Star className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">Product</h3>
              <ul className="space-y-3">
                {['Features', 'Pricing', 'API', 'Documentation'].map((item) => (
                  <li key={item}>
                    <a href={item === 'Features' ? '#features' : item === 'Pricing' ? '#pricing' : '#'} className="text-white/70 transition-colors hover:text-white">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">Support</h3>
              <ul className="space-y-3">
                {['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-white/70 transition-colors hover:text-white">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-white/20 pt-8 text-center">
            <p className="text-white/60">
              © 2024 AudioGen. All rights reserved. Made with ❤️ for better accessibility.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
