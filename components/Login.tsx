
import React, { useState } from 'react';
import { User, Mail, Sparkles, ArrowRight, Star, Globe } from 'lucide-react';
import { UserProfile } from '../types';

interface LoginProps {
  onLogin: (profile: UserProfile, language: string) => void;
}

// List of major world languages
export const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'zh', name: 'Chinese (Mandarin)', native: '中文' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
  { code: 'pt', name: 'Portuguese', native: 'Português' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'ur', name: 'Urdu', native: 'اردو' },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia' },
  { code: 'it', name: 'Italian', native: 'Italiano' },
  { code: 'ko', name: 'Korean', native: '한국어' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt' },
  { code: 'th', name: 'Thai', native: 'ไทย' },
];

// UI Translations for the static login screen
const TRANSLATIONS: Record<string, any> = {
  en: { title: "Create Your Profile", subtitle: "Join LuminaDecor to start styling your events with AI.", name: "Full Name", email: "Email Address", role: "I am a...", btn: "Start Styling", trusted: "Trusted by 10,000+ Decorators" },
  hi: { title: "अपनी प्रोफ़ाइल बनाएं", subtitle: "AI के साथ अपने आयोजनों को स्टाइल करने के लिए LuminaDecor से जुड़ें।", name: "पूरा नाम", email: "ईमेल पता", role: "मैं हूँ एक...", btn: "स्टार्ट स्टाइलिंग", trusted: "10,000+ डेकोरेटर्स द्वारा विश्वसनीय" },
  es: { title: "Crea tu perfil", subtitle: "Únete a LuminaDecor para diseñar tus eventos con IA.", name: "Nombre completo", email: "Correo electrónico", role: "Yo soy...", btn: "Empezar a diseñar", trusted: "Confiado por +10,000 decoradores" },
  fr: { title: "Créez votre profil", subtitle: "Rejoignez LuminaDecor pour styliser vos événements avec l'IA.", name: "Nom complet", email: "Adresse e-mail", role: "Je suis...", btn: "Commencer", trusted: "Approuvé par +10 000 décorateurs" },
  de: { title: "Profil erstellen", subtitle: "Treten Sie LuminaDecor bei, um Ihre Events mit KI zu gestalten.", name: "Vollständiger Name", email: "E-Mail-Adresse", role: "Ich bin...", btn: "Starten", trusted: "Vertraut von 10.000+ Dekorateuren" },
  zh: { title: "创建您的个人资料", subtitle: "加入 LuminaDecor，开始使用 AI 设计您的活动。", name: "全名", email: "电子邮件地址", role: "我是...", btn: "开始造型", trusted: "受到 10,000+ 装饰师的信赖" },
  ja: { title: "プロフィールを作成", subtitle: "LuminaDecorに参加して、AIでイベントをスタイリングしましょう。", name: "氏名", email: "メールアドレス", role: "私は...", btn: "スタイリングを開始", trusted: "10,000人以上のデコレーターが信頼" },
  ar: { title: "إنشاء ملف التعريف الخاص بك", subtitle: "انضم إلى LuminaDecor لبدء تصميم المناسبات باستخدام الذكاء الاصطناعي.", name: "الاسم الكامل", email: "عنوان البريد الإلكتروني", role: "أنا...", btn: "ابدأ التصميم", trusted: "موثوق به من قبل أكثر من 10,000 مصمم" },
  ru: { title: "Создать профиль", subtitle: "Присоединяйтесь к LuminaDecor для оформления событий с ИИ.", name: "Полное имя", email: "Эл. почта", role: "Я...", btn: "Начать", trusted: "Нам доверяют 10 000+ декораторов" },
  pt: { title: "Crie seu perfil", subtitle: "Junte-se ao LuminaDecor para estilizar seus eventos com IA.", name: "Nome completo", email: "E-mail", role: "Eu sou...", btn: "Começar", trusted: "Confiado por +10.000 decoradores" },
};

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Homeowner');
  const [language, setLanguage] = useState('en');

  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      const initials = name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

      onLogin({
        name,
        email,
        role,
        avatarInitials: initials,
      }, language);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in px-4">
      
      {/* Language Selector Top Right */}
      <div className="absolute top-6 right-6 z-50">
         <div className="relative group">
            <Globe className="absolute left-3 top-2.5 w-4 h-4 text-violet-300 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="appearance-none pl-9 pr-8 py-2 bg-slate-900/80 border border-slate-700 rounded-full text-sm font-medium text-white focus:ring-2 focus:ring-violet-500 outline-none cursor-pointer hover:bg-slate-800 transition-colors shadow-lg backdrop-blur-md"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.native} ({lang.name})
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-3 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-slate-400 pointer-events-none"></div>
         </div>
      </div>

      <div className="w-full max-w-md mt-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-2xl shadow-lg shadow-violet-500/30 mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-heading font-bold text-white mb-2">
            {t.title}
          </h1>
          <p className="text-slate-400">
            {t.subtitle}
          </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl shadow-xl backdrop-blur-md border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-bold text-slate-300 ml-1">
                {t.name}
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aditi Sharma"
                  className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none text-white placeholder:text-slate-600 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-bold text-slate-300 ml-1">
                {t.email}
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. aditi@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none text-white placeholder:text-slate-600 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300 ml-1">
                {t.role}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['Homeowner', 'Event Planner', 'Student', 'Browser'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all border ${
                      role === r
                        ? 'bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-900/40 transform scale-[1.02]'
                        : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white hover:border-slate-500'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 bg-white hover:bg-slate-200 text-slate-900 font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
            >
              {t.btn} <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>{t.trusted}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
