
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Profile } from '../types';

interface ProfileDetailProps {
  profile: Profile;
  isAdmin: boolean;
  onClose: () => void;
  onDelete: () => void;
  onAddImages: (files: File[]) => void;
  onUpdate: (updates: Partial<Profile>) => void;
  onRemoveImage: (imageUrl: string) => void;
}

const ProfileDetail: React.FC<ProfileDetailProps> = ({ profile, isAdmin, onClose, onDelete, onAddImages, onUpdate, onRemoveImage }) => {
  const addImagesInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editCountry, setEditCountry] = useState(profile.country);
  const [editAbout, setEditAbout] = useState(profile.about);
  const [editCategory, setEditCategory] = useState(profile.category);
  const [editInstagram, setEditInstagram] = useState(profile.instagram || '');
  const [editX, setEditX] = useState(profile.x || '');
  const [editFacebook, setEditFacebook] = useState(profile.facebook || '');
  const additionalImages = useMemo(() => {
    const galleryImages = profile.galleryImages || [];
    if (galleryImages.length === 0) return [];
    if (!profile.profileImage) return galleryImages;
    const firstIndex = galleryImages.indexOf(profile.profileImage);
    if (firstIndex === -1) return galleryImages;
    return galleryImages.filter((_, idx) => idx !== firstIndex);
  }, [profile.galleryImages, profile.profileImage]);

  // Enhanced SEO Injection: Update title, description, keywords, and OG tags
  useEffect(() => {
    const originalTitle = document.title;
    const metaTags = {
      description: document.querySelector('meta[name="description"]'),
      keywords: document.querySelector('meta[name="keywords"]'),
      ogTitle: document.querySelector('meta[property="og:title"]'),
      ogDesc: document.querySelector('meta[property="og:description"]'),
      ogImage: document.querySelector('meta[property="og:image"]'),
      ogUrl: document.querySelector('meta[property="og:url"]'),
      twitterTitle: document.querySelector('meta[name="twitter:title"]'),
      twitterDesc: document.querySelector('meta[name="twitter:description"]'),
      twitterImage: document.querySelector('meta[name="twitter:image"]'),
    };

    const originalValues = {
      description: metaTags.description?.getAttribute('content'),
      keywords: metaTags.keywords?.getAttribute('content'),
      ogTitle: metaTags.ogTitle?.getAttribute('content'),
      ogDesc: metaTags.ogDesc?.getAttribute('content'),
      ogImage: metaTags.ogImage?.getAttribute('content'),
      ogUrl: metaTags.ogUrl?.getAttribute('content'),
      twitterTitle: metaTags.twitterTitle?.getAttribute('content'),
      twitterDesc: metaTags.twitterDesc?.getAttribute('content'),
      twitterImage: metaTags.twitterImage?.getAttribute('content'),
    };

    // Construct profile-specific SEO content
    const profileTitle = `${profile.name} - Model from ${profile.country} | VisionRank No. ${profile.rank}`;
    const profileDesc = `Explore the professional profile of ${profile.name} from ${profile.country}. Currently ranked #${profile.rank} with ${profile.views.toLocaleString()} views on VisionRank. ${profile.about}`;
    const profileKeywords = `${profile.name}, ${profile.country} models, fashion model ${profile.name}, VisionRank top 40, ${profile.category} models`;
    const profileUrl = `${window.location.origin}/profile/${profile.id}`;
    const sameAs = [profile.instagram, profile.x, profile.facebook].filter(Boolean);

    // Update tags
    document.title = profileTitle;
    metaTags.description?.setAttribute('content', profileDesc);
    metaTags.keywords?.setAttribute('content', profileKeywords);
    metaTags.ogTitle?.setAttribute('content', profileTitle);
    metaTags.ogDesc?.setAttribute('content', profileDesc);
    metaTags.ogImage?.setAttribute('content', profile.profileImage);
    metaTags.ogUrl?.setAttribute('content', profileUrl);
    metaTags.twitterTitle?.setAttribute('content', profileTitle);
    metaTags.twitterDesc?.setAttribute('content', profileDesc);
    metaTags.twitterImage?.setAttribute('content', profile.profileImage);

    // Inject JSON-LD for rich search results (Person Schema)
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'profile-ld-json';
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org/",
      "@type": "Person",
      "name": profile.name,
      "nationality": {
        "@type": "Country",
        "name": profile.country
      },
      "description": profile.about,
      "image": profile.profileImage,
      "jobTitle": "Fashion Model",
      "url": profileUrl,
      "award": `VisionRank Global Ranking No. ${profile.rank}`,
      ...(sameAs.length > 0 ? { "sameAs": sameAs } : {}),
      "interactionStatistic": {
        "@type": "InteractionCounter",
        "interactionType": "https://schema.org/WatchAction",
        "userInteractionCount": profile.views
      }
    });
    document.head.appendChild(script);

    // Cleanup: Restore original tags
    return () => {
      document.title = originalTitle;
      if (originalValues.description) metaTags.description?.setAttribute('content', originalValues.description);
      if (originalValues.keywords) metaTags.keywords?.setAttribute('content', originalValues.keywords);
      if (originalValues.ogTitle) metaTags.ogTitle?.setAttribute('content', originalValues.ogTitle);
      if (originalValues.ogDesc) metaTags.ogDesc?.setAttribute('content', originalValues.ogDesc);
      if (originalValues.ogImage) metaTags.ogImage?.setAttribute('content', originalValues.ogImage);
      if (originalValues.ogUrl) metaTags.ogUrl?.setAttribute('content', originalValues.ogUrl);
      if (originalValues.twitterTitle) metaTags.twitterTitle?.setAttribute('content', originalValues.twitterTitle);
      if (originalValues.twitterDesc) metaTags.twitterDesc?.setAttribute('content', originalValues.twitterDesc);
      if (originalValues.twitterImage) metaTags.twitterImage?.setAttribute('content', originalValues.twitterImage);
      
      document.getElementById('profile-ld-json')?.remove();
    };
  }, [profile]);

  useEffect(() => {
    setEditName(profile.name);
    setEditCountry(profile.country);
    setEditAbout(profile.about);
    setEditCategory(profile.category);
    setEditInstagram(profile.instagram || '');
    setEditX(profile.x || '');
    setEditFacebook(profile.facebook || '');
  }, [profile]);

  const handleSave = () => {
    onUpdate({
      name: editName.trim(),
      country: editCountry.trim(),
      about: editAbout.trim(),
      category: editCategory.trim(),
      instagram: editInstagram.trim() || undefined,
      x: editX.trim() || undefined,
      facebook: editFacebook.trim() || undefined
    });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white overflow-y-auto animate-in fade-in slide-in-from-bottom-10 duration-500">
      <div className="sticky top-0 z-10 flex justify-between items-center px-6 md:px-10 py-6 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="text-xl font-serif font-black tracking-tighter text-black">
            VISION<span className="font-light italic">RANK</span>
          </div>
          <div className="h-4 w-[1px] bg-gray-200"></div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Rank #{profile.rank}</span>
        </div>
        <button 
          onClick={onClose}
          className="p-3 bg-black text-white rounded-full hover:bg-gray-800 transition-all active:scale-95 shadow-lg"
          aria-label="Close Profile"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="container mx-auto max-w-7xl px-6 md:px-10 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Portrait Column */}
          <div className="lg:col-span-6">
            <div className="max-w-3xl mx-auto">
              {profile.profileImage && (
                <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl bg-gray-50 border border-gray-100 group">
                  <img 
                    src={profile.profileImage} 
                    alt={`${profile.name} - Professional Model from ${profile.country}`} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              )}
              {isAdmin && (
                <div className="mt-6">
                  <button
                    onClick={() => addImagesInputRef.current?.click()}
                    className="px-6 py-3 border border-gray-200 text-[10px] font-bold uppercase tracking-[0.3em] rounded-full hover:border-black hover:text-black transition-all"
                  >
                    Add Photos
                  </button>
                  <input
                    ref={addImagesInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 0) onAddImages(files);
                      if (addImagesInputRef.current) addImagesInputRef.current.value = '';
                    }}
                  />
                </div>
              )}
              <div className="mt-8 flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">
                <span>Full Portfolio View</span>
                <span>Archive Ref: {profile.id.slice(0, 8)}</span>
              </div>
            </div>
          </div>

          {/* Identity Column */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="space-y-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="h-[1px] w-6 bg-black"></span>
                  <span className="text-[11px] font-bold text-black uppercase tracking-[0.4em]">{profile.country}</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-serif font-bold italic leading-none tracking-tight text-black">
                  {profile.name}
                </h1>
              </div>

              <div className="space-y-6">
                <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.3em] pb-4 border-b border-gray-50">About Her</h2>
                <p className="text-2xl md:text-3xl text-gray-700 font-light leading-relaxed italic font-serif">
                  {profile.about}
                </p>
              </div>
              {isAdmin && isEditing && (
                <div className="space-y-4 border border-gray-100 rounded-[2rem] p-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Nombre</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">País</label>
                    <input
                      type="text"
                      value={editCountry}
                      onChange={(e) => setEditCountry(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Descripción</label>
                    <textarea
                      value={editAbout}
                      onChange={(e) => setEditAbout(e.target.value)}
                      className="w-full min-h-[90px] px-4 py-3 rounded-2xl border border-gray-100 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Categoría</label>
                    <input
                      type="text"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Instagram</label>
                    <input
                      type="url"
                      value={editInstagram}
                      onChange={(e) => setEditInstagram(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">X</label>
                    <input
                      type="url"
                      value={editX}
                      onChange={(e) => setEditX(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Facebook</label>
                    <input
                      type="url"
                      value={editFacebook}
                      onChange={(e) => setEditFacebook(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex-[2] py-3 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-gray-800 transition-all"
                    >
                      Guardar Cambios
                    </button>
                  </div>
                </div>
              )}
              {(profile.instagram || profile.x || profile.facebook) && (
                <div className="space-y-4">
                  <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.3em]">Social Links</h3>
                  <div className="flex flex-wrap gap-3">
                    {profile.instagram && (
                      <a
                        href={profile.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 border border-gray-200 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-black hover:border-black transition-colors"
                      >
                        Instagram
                      </a>
                    )}
                    {profile.x && (
                      <a
                        href={profile.x}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 border border-gray-200 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-black hover:border-black transition-colors"
                      >
                        X
                      </a>
                    )}
                    {profile.facebook && (
                      <a
                        href={profile.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 border border-gray-200 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-black hover:border-black transition-colors"
                      >
                        Facebook
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6 pt-8">
                <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                  <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Live Views</span>
                  <span className="text-4xl font-serif font-bold">{profile.views.toLocaleString()}</span>
                </div>
                <div className="p-8 bg-black text-white rounded-[2rem] shadow-xl">
                  <span className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Global Position</span>
                  <span className="text-4xl font-serif font-bold italic">#{profile.rank}</span>
                </div>
              </div>

              {isAdmin && (
                <div className="pt-12 space-y-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full py-5 border border-gray-200 text-gray-500 hover:text-black hover:border-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-full transition-all"
                  >
                    Editar Perfil
                  </button>
                  <button 
                    onClick={onDelete}
                    className="w-full py-5 border border-red-100 text-red-400 hover:bg-red-50 text-[10px] font-bold uppercase tracking-[0.3em] rounded-full transition-all"
                  >
                    Delete Profile Archive
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="max-w-5xl mx-auto mt-6 space-y-6">
            {additionalImages.length > 0 ? (
              additionalImages.map((image, idx) => (
                <div key={`${profile.id}-full-${idx}`} className="relative">
                  {isAdmin && (
                    <button
                      onClick={() => onRemoveImage(image)}
                      className="absolute top-3 right-3 z-10 px-3 py-2 bg-white/90 text-[9px] font-bold uppercase tracking-widest text-gray-500 rounded-full border border-gray-100 hover:text-black hover:border-black transition-colors"
                    >
                      Remove
                    </button>
                  )}
                  <img
                    src={image}
                    alt={`${profile.name} ${idx + 1}`}
                    className="w-full h-auto rounded-xl"
                    loading="lazy"
                  />
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 italic text-center">No hay fotos adicionales</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;
