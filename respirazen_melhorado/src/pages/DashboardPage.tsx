
import Dashboard from '@/components/Dashboard/Dashboard';
import { SEO } from '@/components/SEO';

export default function DashboardPage() {
  return (
    <>
      <SEO
        title="Dashboard - RespiraZen"
        description="Acompanhe seu progresso de meditação e respiração guiada. Veja suas estatísticas, conquistas e evolução."
        canonical="https://respirazen.app/dashboard"
      />
      <Dashboard />
    </>
  );
}
