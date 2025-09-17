
import Community from '@/components/Community/Community';
import { SEO } from '@/components/SEO';

export default function CommunityPage() {
  return (
    <>
      <SEO
        title="Comunidade - RespiraZen"
        description="Conecte-se com outros praticantes de meditação e respiração guiada. Compartilhe experiências e inspire-se."
        canonical="https://respirazen.app/comunidade"
      />
      <Community />
    </>
  );
}
