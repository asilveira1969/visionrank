
import React, { useState, useEffect, useMemo } from 'react';
import { analyzeProfile } from './services/geminiService';
import { Profile } from './types';
import Header from './components/Header';
import Hero from './components/Hero';
import ImageGrid from './components/ImageGrid';
import UploadModal from './components/UploadModal';
import RankingLeaderboard from './components/RankingLeaderboard';
import ProfileDetail from './components/ProfileDetail';
import LoginModal from './components/LoginModal';

const LOCAL_STORAGE_KEY = 'vision_rank_profiles_v3';
const ADMIN_STORAGE_KEY = 'vision_rank_admin_status';

const App: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Profile[];
        const normalized = parsed.map((profile) => ({
          ...profile,
          galleryImages: profile.galleryImages && profile.galleryImages.length > 0
            ? profile.galleryImages
            : profile.profileImage
              ? [profile.profileImage]
              : []
        }));
        setProfiles(normalized);
      } catch (e) {
        console.error("Failed to parse storage", e);
      }
    }

    const adminStatus = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (adminStatus === 'true') {
      setIsAdmin(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profiles));
  }, [profiles]);

  const handleAdminLogin = (password: string): boolean => {
    if (password === 'admin') {
      setIsAdmin(true);
      localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
      setIsLoginOpen(false);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.setItem(ADMIN_STORAGE_KEY, 'false');
  };

  const rankedProfiles = useMemo(() => {
    return [...profiles].sort((a, b) => {
      if (b.views !== a.views) return b.views - a.views;
      return b.uploadedAt - a.uploadedAt;
    }).map((profile, index) => ({
      ...profile,
      rank: index + 1
    }));
  }, [profiles]);

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async (files: File[]) => {
    if (!isAdmin) return;
    if (files.length === 0) return;

    setIsRefreshing(true);
    const images = await Promise.all(files.map(readFileAsDataURL));
    const primaryImage = images[0];

    const analysis = await analyzeProfile(primaryImage);
    
    const newProfile: Profile = {
      id: crypto.randomUUID(),
      profileImage: primaryImage,
      galleryImages: images,
      name: analysis.name,
      country: analysis.country,
      about: analysis.about,
      category: analysis.category,
      views: Math.floor(Math.random() * 20),
      rank: profiles.length + 1,
      uploadedAt: Date.now()
    };

    setProfiles(prev => [newProfile, ...prev]);
    setIsRefreshing(false);
    setIsUploadOpen(false);
  };

  const handleSelectProfile = (id: string) => {
    setProfiles(prev => prev.map(p => 
      p.id === id ? { ...p, views: p.views + 1 } : p
    ));
    const profile = rankedProfiles.find(p => p.id === id);
    if (profile) setSelectedProfile(profile);
  };

  const handleDelete = (id: string) => {
    if (!isAdmin) return;
    if (confirm("Permanently de-list this profile from the rankings?")) {
      setProfiles(prev => prev.filter(p => p.id !== id));
      setSelectedProfile(null);
    }
  };

  const handleAddImages = async (id: string, files: File[]) => {
    if (!isAdmin || files.length === 0) return;
    const images = await Promise.all(files.map(readFileAsDataURL));
    setProfiles(prev => prev.map(profile => {
      if (profile.id !== id) return profile;
      const nextGallery = [...(profile.galleryImages || []), ...images];
      return {
        ...profile,
        profileImage: profile.profileImage || images[0],
        galleryImages: nextGallery
      };
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-black selection:text-white">
      <Header isAdmin={isAdmin} onUploadClick={() => setIsUploadOpen(true)} />
      
      <main className="flex-grow container mx-auto px-6 py-12 max-w-[1400px]">
        <Hero />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-9">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl font-serif font-bold italic tracking-tight text-black">Talent Archive</h2>
              <div className="h-[1px] flex-grow mx-8 bg-gray-100 hidden md:block"></div>
            </div>
            <ImageGrid 
              images={rankedProfiles.map(p => ({
                id: p.id,
                url: p.profileImage,
                title: p.name,
                description: p.about,
                category: p.category,
                country: p.country,
                views: p.views,
                rank: p.rank,
                uploadedAt: p.uploadedAt
              }))} 
              onImageClick={handleSelectProfile}
              isLoading={isRefreshing}
            />
          </div>
          
          <div className="lg:col-span-3">
            <RankingLeaderboard images={rankedProfiles.map(p => ({
                id: p.id,
                url: p.profileImage,
                title: p.name,
                views: p.views,
                rank: p.rank,
                category: p.category,
                description: p.about,
                uploadedAt: p.uploadedAt,
                country: p.country
            })).slice(0, 10)} />
          </div>
        </div>
      </main>

      {isLoginOpen && (
        <LoginModal 
          onClose={() => setIsLoginOpen(false)} 
          onLogin={handleAdminLogin} 
        />
      )}

      {isUploadOpen && (
        <UploadModal 
          isOpen={isUploadOpen} 
          onClose={() => setIsUploadOpen(false)} 
          onUpload={handleUpload}
          isAnalyzing={isRefreshing}
        />
      )}

      {selectedProfile && (
        <ProfileDetail
          profile={selectedProfile}
          isAdmin={isAdmin}
          onClose={() => setSelectedProfile(null)}
          onDelete={() => handleDelete(selectedProfile.id)}
          onAddImages={(files) => handleAddImages(selectedProfile.id, files)}
        />
      )}

      <footer className="bg-white border-t border-gray-100 py-32 mt-24">
        <div className="container mx-auto px-6 text-center space-y-12">
          <div className="text-4xl font-serif font-black tracking-tighter text-black">
            VISION<span className="font-light italic">RANK</span>
          </div>
          <div className="max-w-md mx-auto">
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.4em] mb-4">
              Curation Policy
            </p>
            <p className="text-gray-500 text-sm leading-relaxed italic">
              Entries are analyzed by our Vision AI engine for aesthetic consistency. 
              Ranking is determined purely by audience engagement metrics.
            </p>
          </div>
          
          {isAdmin && (
            <div className="max-w-xs mx-auto py-4 px-6 bg-gray-50 border border-gray-100 rounded-2xl">
              <span className="block text-[8px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Sync Status</span>
              <a 
                href="https://github.com/asilveira1969/visionrank" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[9px] font-bold text-blue-500 hover:text-blue-700 uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                asilveira1969 / visionrank
              </a>
            </div>
          )}

          <div className="pt-12 border-t border-gray-50 flex flex-col items-center gap-6">
            <p className="text-gray-300 text-[10px] font-bold uppercase tracking-[0.3em]">
              &copy; {new Date().getFullYear()} Elite Visual Curation Archive
            </p>
            <button 
              onClick={() => isAdmin ? handleLogout() : setIsLoginOpen(true)}
              className="text-[10px] text-gray-400 hover:text-black font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 px-8 py-3 border border-gray-100 rounded-full"
            >
              {isAdmin ? "Exit Curator Mode" : "Secure Access"}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
