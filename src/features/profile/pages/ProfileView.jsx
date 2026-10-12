import { useProfile } from "../hooks/useProfile";
import { ProfileHeader } from "../components/ProfileHeader";
import { AboutSection } from "../components/AboutSection";
import { ProfileRanking } from "../components/ProfileRanking";
import { ProfileReviews } from "../components/ProfileReviews";

export default function ProfileView() {
  const { profile, reviews, loading, error, isOwnProfile } = useProfile();

  if (loading) return <div className="flex h-64 items-center justify-center text-slate-300">Cargando perfil...</div>;
  if (error) return <div role="alert" className="p-4 text-center text-red-300">{error}</div>;
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-[var(--color-background-main)] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-2xl space-y-5 sm:space-y-6">
        
        <ProfileHeader 
          player={profile} 
          isOwnProfile={isOwnProfile} 
          onEditClick={() => console.log("Editar perfil")} 
        />
        
        <AboutSection player={profile} />
        
        <ProfileRanking ranking={profile.reputacion} />
        
        <ProfileReviews reviews={reviews} />

      </div>
    </div>
  );
}