import { Metadata } from 'next';
import PilotDossier from '@/components/account/PilotDossier';

export const metadata: Metadata = {
  title: 'Pilot Dossier | AviationGreeks',
  description: 'Manage your classified AviationGreeks operative profile.',
};

export default function AccountPage() {
  return <PilotDossier />;
}
