import { ReactNode } from 'react';
import AppLayout from '@/layouts/AppLayout';
import RoleBadge from '@/components/RoleBadge';
import { ShieldCheck } from 'lucide-react';

interface AdminLayoutProps {
  title?: string;
  children: ReactNode;
}

/**
 * Layout khusus Admin platform. Sidebar otomatis menampilkan menu admin
 * (Pengguna, Komunitas, Master Data) lewat AppLayout(role="Admin").
 */
export default function AdminLayout({ title, children }: AdminLayoutProps) {
  return (
    <AppLayout title={title} role="Admin">
      <div className="mb-6 flex justify-end">
        <RoleBadge icon={ShieldCheck} label="Administrator" accent="#C1443C" />
      </div>
      {children}
    </AppLayout>
  );
}
