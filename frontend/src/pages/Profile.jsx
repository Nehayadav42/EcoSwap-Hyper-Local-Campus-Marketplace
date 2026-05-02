import { useState, useRef, useEffect, useCallback, useId } from 'react';
import { Camera, MapPin, Edit2, Check, Loader2, Leaf, Mail, Award, User as UserIcon, X, Copy, Recycle, Sparkles, Lock, ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 380, damping: 28 } },
};

const Profile = () => {
  const bannerDotPatternId = useId().replace(/:/g, '');
  const bannerLeafClipId = useId().replace(/:/g, '');
  const fileInputRef = useRef(null);
  const userInfo = JSON.parse(localStorage.getItem('ecoswap_user')) || {};

  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarHover, setAvatarHover] = useState(false);
  const [swapStats, setSwapStats] = useState({ completed: 0, active: 0, ecoKg: '0.0' });
  const [statsLoading, setStatsLoading] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);

  const [firstName, setFirstName] = useState(userInfo.name?.split(' ')[0] || 'Neha');
  const [lastName, setLastName] = useState(userInfo.name?.split(' ').slice(1).join(' ') || '');
  const [location, setLocation] = useState(userInfo.location || 'Indore, Madhya Pradesh');
  const [avatar, setAvatar] = useState(userInfo.avatar || '');

  const fetchSwapStats = useCallback(async () => {
    if (!userInfo._id) return;
    setStatsLoading(true);
    try {
      const { data } = await axios.get(`http://localhost:5000/api/swaps/history?userId=${userInfo._id}`);
      const completed = data.filter((o) => o.status === 'completed');
      const active = data.filter((o) => o.status !== 'completed');
      const ecoKg = completed
        .reduce((t, o) => t + Number(o.suggestedProducts?.[0]?.estimatedEcoScore || 1.5), 0)
        .toFixed(1);
      setSwapStats({ completed: completed.length, active: active.length, ecoKg });
    } catch {
      /* keep zeros */
    } finally {
      setStatsLoading(false);
    }
  }, [userInfo._id]);

  useEffect(() => {
    fetchSwapStats();
  }, [fetchSwapStats]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setIsUploading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/upload', formData);
      setAvatar(data.imageUrl);
      const current = JSON.parse(localStorage.getItem('ecoswap_user')) || {};
      const updatedUser = { ...current, avatar: data.imageUrl };
      localStorage.setItem('ecoswap_user', JSON.stringify(updatedUser));
      toast.success('Avatar updated!');
    } catch {
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDropAvatar = (e) => {
    e.preventDefault();
    setAvatarHover(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type?.startsWith('image/')) {
      handleAvatarUpload({ target: { files: [file] } });
    } else if (file) {
      toast.error('Please drop an image file');
    }
  };

  const handleSaveProfile = () => {
    const current = JSON.parse(localStorage.getItem('ecoswap_user')) || {};
    const updatedUser = { ...current, name: `${firstName} ${lastName}`.trim(), location, avatar };
    localStorage.setItem('ecoswap_user', JSON.stringify(updatedUser));
    setIsEditing(false);
    toast.success('Profile saved!');
  };

  const handleCancelEdit = () => {
    const saved = JSON.parse(localStorage.getItem('ecoswap_user')) || {};
    setFirstName(saved.name?.split(' ')[0] || 'Neha');
    setLastName(saved.name?.split(' ').slice(1).join(' ') || '');
    setLocation(saved.location || 'Indore, Madhya Pradesh');
    setAvatar(saved.avatar || '');
    setIsEditing(false);
  };

  const copyEmail = async () => {
    const email = userInfo.email || '';
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      toast.success('Email copied');
    } catch {
      toast.error('Could not copy');
    }
  };

  const levelProgress = Math.min(100, swapStats.completed * 20);

  const badges = [
    {
      id: 'starter',
      title: 'Eco Starter',
      subtitle: 'Level 1',
      desc: 'Welcome to the campus circle — keep swapping to grow your impact.',
      icon: Leaf,
      unlocked: true,
      color: 'bg-eco',
    },
    {
      id: 'recycler',
      title: 'Campus Recycler',
      subtitle: 'Level 2',
      desc: 'Unlock after 3 completed swaps.',
      icon: Recycle,
      unlocked: swapStats.completed >= 3,
      color: 'bg-emerald-600',
    },
  ];

  return (
    <motion.div
      className="max-w-5xl mx-auto space-y-8 pb-16 px-4 sm:px-0"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      {/* PROFILE HEADER — banner is decorative only; stats sit in body so nothing overlaps the name */}
      <motion.div variants={itemVariants} className="relative">
        <div className="bg-white rounded-[32px] overflow-hidden border border-gray-200/80 shadow-lg shadow-eco/5">
          <div className="relative h-28 sm:h-32 overflow-hidden shrink-0">
            {/* Mesh + depth (replaces flat green) */}
            <div
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(ellipse 100% 140% at 0% 50%, rgba(192, 221, 151, 0.5) 0%, transparent 52%),
                  radial-gradient(ellipse 80% 100% at 100% 80%, rgba(15, 45, 8, 0.55) 0%, transparent 48%),
                  radial-gradient(circle at 52% 25%, rgba(255, 255, 255, 0.22) 0%, transparent 38%),
                  radial-gradient(ellipse 60% 70% at 78% 15%, rgba(90, 154, 36, 0.35) 0%, transparent 45%),
                  linear-gradient(118deg, #1a3d06 0%, #2d630d 32%, #3b6d11 58%, #264f0c 100%)
                `,
              }}
            />
            {/* Soft vignette */}
            <div
              className="absolute inset-0 pointer-events-none opacity-90"
              style={{
                background:
                  'radial-gradient(ellipse 95% 85% at 50% 50%, transparent 40%, rgba(12, 35, 6, 0.35) 100%)',
              }}
            />
            {/* Dot texture */}
            <svg className="absolute inset-0 h-full w-full pointer-events-none" aria-hidden>
              <defs>
                <pattern id={bannerDotPatternId} width="16" height="16" patternUnits="userSpaceOnUse">
                  <circle cx="1.5" cy="1.5" r="1.1" fill="#fff" fillOpacity="0.14" />
                  <circle cx="9" cy="9" r="0.85" fill="#fff" fillOpacity="0.09" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#${bannerDotPatternId})`} />
            </svg>
            {/* Large decorative leaf (outline, eco motif) */}
            <svg
              className="absolute -right-6 top-1/2 h-[140%] w-auto min-w-[140px] -translate-y-1/2 opacity-[0.14] text-eco-light pointer-events-none"
              viewBox="0 0 120 200"
              aria-hidden
            >
              <defs>
                <linearGradient id={bannerLeafClipId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <path
                fill={`url(#${bannerLeafClipId})`}
                d="M60 8 C28 48 8 92 12 138 c4 38 28 54 48 58 18-6 38-28 42-62 6-52-10-98-42-126zm-4 118 c-10-22-8-52 6-78 14 24 18 54 10 78-6-4-12-6-16 0z"
              />
            </svg>
            {/* Film grain */}
            <div
              className="absolute inset-0 opacity-[0.045] mix-blend-overlay pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              }}
            />
            {/* Bottom fade into card */}
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/15 to-transparent pointer-events-none" />
            <motion.div
              className="absolute -right-8 -top-10 w-44 h-44 rounded-full bg-lime-200/20 blur-3xl"
              animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.35, 0.2] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute -left-6 bottom-0 w-36 h-28 rounded-full bg-emerald-400/15 blur-2xl"
              animate={{ y: [0, -8, 0], x: [0, 4, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          <div className="px-5 sm:px-8 pb-8 pt-0 relative">
            {/* Identity row: avatar + name block + actions (single clear band) */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-5 sm:gap-6">
              <div
                className="relative group flex justify-center sm:justify-start shrink-0 -mt-14 sm:-mt-16"
                onDragOver={(e) => {
                  e.preventDefault();
                  setAvatarHover(true);
                }}
                onDragLeave={() => setAvatarHover(false)}
                onDrop={handleDropAvatar}
              >
                <div className="flex flex-col items-center sm:items-start">
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0">
                    <motion.div
                      className={`w-full h-full rounded-full bg-white p-1 shadow-xl ring-2 transition-all duration-300 ${
                        avatarHover ? 'ring-eco ring-offset-2 ring-offset-white scale-[1.02]' : 'ring-white'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 24 }}
                    >
                      <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100">
                        {isUploading ? (
                          <Loader2 className="w-8 h-8 animate-spin text-eco" />
                        ) : avatar ? (
                          <img
                            src={avatar}
                            className="w-full h-full object-cover"
                            alt={`${firstName} ${lastName}`.trim() || 'Profile'}
                          />
                        ) : (
                          <span className="text-3xl sm:text-4xl font-black text-eco">{firstName[0]?.toUpperCase() || '?'}</span>
                        )}
                      </div>
                    </motion.div>
                    <input type="file" ref={fileInputRef} accept="image/*" onChange={handleAvatarUpload} hidden />
                    <motion.button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.94 }}
                      className="absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 bg-white p-2 rounded-full shadow-lg border border-gray-200 text-gray-700 hover:text-eco hover:border-eco-border transition-colors"
                      aria-label="Change profile photo"
                    >
                      <Camera className="w-4 h-4" />
                    </motion.button>
                  </div>
                  <p className="mt-2 text-center text-[11px] text-gray-400 sm:hidden">Tap camera or drop a photo</p>
                </div>
              </div>

              <div className="flex-1 min-w-0 flex flex-col gap-5 sm:pt-1">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="text-center sm:text-left min-w-0">
                    <motion.h1
                      className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight break-words"
                      layout
                    >
                      {firstName} {lastName}
                    </motion.h1>
                    <p className="text-gray-500 font-medium flex items-center justify-center sm:justify-start gap-1.5 mt-1.5 text-sm">
                      <MapPin className="w-4 h-4 text-eco shrink-0" />
                      <span className="break-words">{location}</span>
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto lg:shrink-0">
                    <AnimatePresence mode="wait">
                      {isEditing ? (
                        <motion.div
                          key="editing"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto"
                        >
                          <motion.button
                            type="button"
                            onClick={handleSaveProfile}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            className="px-6 py-3 rounded-2xl text-sm font-bold shadow-md bg-eco text-white hover:bg-eco-dark transition-colors flex items-center justify-center gap-2"
                          >
                            <Check className="w-4 h-4" /> Save
                          </motion.button>
                          <motion.button
                            type="button"
                            onClick={handleCancelEdit}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            className="px-6 py-3 rounded-2xl text-sm font-bold border-2 border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                          >
                            <X className="w-4 h-4" /> Cancel
                          </motion.button>
                        </motion.div>
                      ) : (
                        <motion.button
                          key="view"
                          type="button"
                          onClick={() => setIsEditing(true)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          className="px-6 py-3 rounded-2xl text-sm font-bold shadow-md bg-gray-900 text-white hover:bg-gray-800 flex items-center justify-center gap-2 w-full sm:w-auto"
                        >
                          <Edit2 className="w-4 h-4" /> Edit profile
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Stats: fixed grid below identity — no overlap with title */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { label: 'Completed', value: statsLoading ? '—' : swapStats.completed, icon: Check },
                    { label: 'In progress', value: statsLoading ? '—' : swapStats.active, icon: Sparkles },
                    { label: 'Eco (kg)', value: statsLoading ? '—' : swapStats.ecoKg, icon: Leaf },
                  ].map((stat) => (
                    <motion.div
                      key={stat.label}
                      whileHover={{ y: -2 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                      className="rounded-2xl border border-gray-100 bg-eco-card/60 px-2 py-3 sm:px-3 sm:py-4 text-center"
                    >
                      <stat.icon className="w-4 h-4 text-eco mx-auto mb-1 opacity-80 hidden sm:block" />
                      <p className="text-lg sm:text-xl font-black text-gray-900 tabular-nums leading-none">{stat.value}</p>
                      <p className="text-[10px] sm:text-xs font-semibold text-gray-500 mt-1 leading-tight">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Level progress */}
                <div className="max-w-xl sm:max-w-none">
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    <span>Next level</span>
                    <span className="tabular-nums text-eco">{levelProgress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden border border-gray-100">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-eco to-[#6cb82a]"
                      initial={{ width: 0 }}
                      animate={{ width: `${levelProgress}%` }}
                      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">
                    Complete swaps on the dashboard to fill the bar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Equal columns so Achievements and Account feel balanced */}
      <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-stretch">
        {/* ACHIEVEMENTS */}
        <motion.div variants={itemVariants} className="flex min-h-0">
          <div className="bg-white p-6 rounded-[24px] border border-gray-200/80 shadow-md shadow-gray-200/50 flex flex-col w-full h-full min-h-[320px]">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 shrink-0">
              <Award className="w-5 h-5 text-amber-500" /> Achievements
            </h3>
            <div className="space-y-3 flex-1">
              {badges.map((b) => {
                const Icon = b.icon;
                const active = selectedBadge === b.id;
                return (
                  <motion.button
                    key={b.id}
                    type="button"
                    layout
                    onClick={() => setSelectedBadge(active ? null : b.id)}
                    whileHover={b.unlocked ? { scale: 1.02 } : {}}
                    whileTap={b.unlocked ? { scale: 0.98 } : {}}
                    className={`w-full text-left flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                      b.unlocked
                        ? active
                          ? 'bg-eco-light/50 border-eco shadow-sm ring-2 ring-eco/20'
                          : 'bg-eco-light/20 border-eco-border hover:border-eco hover:shadow-md'
                        : 'bg-gray-50 border-gray-100 opacity-75 cursor-not-allowed'
                    }`}
                  >
                    <div
                      className={`${b.unlocked ? b.color : 'bg-gray-300'} text-white p-2.5 rounded-xl shadow-sm shrink-0`}
                    >
                      {b.unlocked ? <Icon className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1">
                        {b.title}
                        {b.unlocked && <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${active ? 'rotate-90' : ''}`} />}
                      </h4>
                      <p className="text-[10px] font-bold text-eco uppercase tracking-widest">{b.subtitle}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
            <AnimatePresence>
              {selectedBadge && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden shrink-0"
                >
                  <p className="text-sm text-gray-600 mt-4 pt-4 border-t border-gray-100 leading-relaxed">
                    {badges.find((x) => x.id === selectedBadge)?.desc}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ACCOUNT */}
        <motion.div variants={itemVariants} className="flex min-h-0">
          <motion.div
            animate={
              isEditing
                ? { boxShadow: '0 0 0 2px rgba(59, 109, 17, 0.25), 0 20px 40px -12px rgba(59, 109, 17, 0.15)' }
                : { boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.06)' }
            }
            transition={{ duration: 0.25 }}
            className="bg-white p-6 sm:p-8 rounded-[24px] border border-gray-200/80 w-full h-full min-h-[320px] flex flex-col"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
              <h3 className="font-bold text-gray-900 text-xl flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-eco" /> Account
              </h3>
              <span
                className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                  isEditing ? 'bg-eco-light text-eco-dark' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {isEditing ? 'Editing' : 'View only'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-2">
                <label htmlFor="profile-first" className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                  First name
                </label>
                <input
                  id="profile-first"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={!isEditing}
                  className={`w-full p-4 rounded-2xl border text-sm transition-all outline-none ${
                    isEditing
                      ? 'border-eco focus:ring-4 focus:ring-eco/15 bg-white'
                      : 'border-transparent bg-gray-50 text-gray-600'
                  }`}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="profile-last" className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                  Last name
                </label>
                <input
                  id="profile-last"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={!isEditing}
                  className={`w-full p-4 rounded-2xl border text-sm transition-all outline-none ${
                    isEditing
                      ? 'border-eco focus:ring-4 focus:ring-eco/15 bg-white'
                      : 'border-transparent bg-gray-50 text-gray-600'
                  }`}
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                <div className="relative group/email">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    value={userInfo.email || ''}
                    readOnly
                    className="w-full pl-12 pr-14 py-4 rounded-2xl border border-transparent bg-gray-50 text-gray-500 text-sm cursor-default"
                  />
                  <motion.button
                    type="button"
                    onClick={copyEmail}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl text-gray-500 hover:text-eco hover:bg-eco-light/50 transition-colors"
                    title="Copy email"
                    aria-label="Copy email"
                  >
                    <Copy className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label htmlFor="profile-location" className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                  City &amp; state
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    id="profile-location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    disabled={!isEditing}
                    className={`w-full pl-12 py-4 rounded-2xl border text-sm transition-all outline-none ${
                      isEditing
                        ? 'border-eco focus:ring-4 focus:ring-eco/15 bg-white'
                        : 'border-transparent bg-gray-50 text-gray-600'
                    }`}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile;
