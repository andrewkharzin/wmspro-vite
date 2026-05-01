// app/account/page.tsx
import { createServerSupabaseClient } from '@/lib/supabase/clients/server.client';
import { redirect } from 'next/navigation';
import AccountView from '@/components/AccountView';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Метаданные страницы
export const metadata = {
  title: 'Account Settings | NexusAI WMS',
  description: 'Manage your profile and company settings',
};

async function getProfileData(userId: string) {
  const supabase = await createServerSupabaseClient();

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  const { data: company, error: companyError } = await supabase
    .from('companies')
    .select('*')
    .eq('is_own_company', true)
    .maybeSingle();

  if (profileError) {
    console.error('Error fetching profile:', profileError);
    return { profile: null, company: null };
  }

  return { profile, company };
}

export default async function AccountPage() {
  const supabase = await createServerSupabaseClient();

  // Проверяем авторизацию
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // Получаем данные на сервере - ОДИН ЗАПРОС!
  const { profile, company } = await getProfileData(session.user.id);

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Profile not found</h2>
          <p className="text-slate-500">Please contact support</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<AccountSkeleton />}>
      <AccountView
        initialProfile={profile}
        initialCompany={company}
        userId={session.user.id}
      />
    </Suspense>
  );
}

// Скелетон для загрузки
function AccountSkeleton() {
  return (
    <div className="flex flex-col gap-8 h-[calc(100vh-140px)] overflow-hidden">
      <div className="flex justify-between items-center px-8 pt-8">
        <div>
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-12 w-32" />
      </div>
      <div className="flex-1 bg-white/80 rounded-2xl flex overflow-hidden mx-8 mb-8">
        <div className="w-80 border-r p-6 space-y-2">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
        <div className="flex-1 p-8 space-y-6">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}