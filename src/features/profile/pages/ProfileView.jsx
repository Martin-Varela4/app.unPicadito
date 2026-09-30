import { useProfile } from "../hooks/useProfile";
import { ProfileHeader } from "../components/ProfileHeader";
import { AboutSection } from "../components/AboutSection";
import { ProfileRanking } from "../components/ProfileRanking";
import { ProfileReviews } from "../components/ProfileReviews";

export default function ProfileView() {
  const { profile, reviews, loading, error, isOwnProfile } = useProfile();

  if (loading) return <div className="flex justify-center items-center h-64">Cargando perfil...</div>;
  if (error) return <div className="text-center p-4 text-red-600">{error}</div>;
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
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