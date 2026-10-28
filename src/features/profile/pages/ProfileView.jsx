import { useNavigate } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";
import { ProfileHeader } from "../components/ProfileHeader";
import { AboutSection } from "../components/AboutSection";
import { ProfileRanking } from "../components/ProfileRanking";
import { ProfileReviews } from "../components/ProfileReviews";
import PageContainer from "../../../components/ui/PageContainer";
import LoadingState from "../../../components/ui/LoadingState";
import ErrorAlert from "../../../components/ui/ErrorAlert";

export default function ProfileView() {
  const { profile, reviews, loading, error, isOwnProfile } = useProfile();
  const navigate = useNavigate();

  if (loading) {
    return <LoadingState label="Cargando perfil..." className="h-64" />;
  }

  if (error) {
    return (
      <PageContainer size="sm">
        <ErrorAlert message={error} />
      </PageContainer>
    );
  }

  if (!profile) return null;

  return (
    <PageContainer size="sm" className="space-y-5 sm:space-y-6">
      <ProfileHeader 
        player={profile} 
        isOwnProfile={isOwnProfile} 
        onEditClick={() => navigate("/profile/edit")}
      />
      
      <AboutSection player={profile} />
      
      <ProfileRanking ranking={profile.reputacion} />
      
      <ProfileReviews reviews={reviews} />
    </PageContainer>
  );
}
