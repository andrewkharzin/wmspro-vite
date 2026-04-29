// app/debug/page.tsx (создайте временную страницу)
'use client';

import { useEffect, useState } from 'react';

export default function DebugPage() {
  const [envStatus, setEnvStatus] = useState<any>({});

  useEffect(() => {
    setEnvStatus({
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      urlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length,
    });
  }, []);

  return (
    <div className="p-8">
      <h1>Environment Variables Debug</h1>
      <pre className="bg-gray-100 p-4 rounded mt-4">
        {JSON.stringify(envStatus, null, 2)}
      </pre>
    </div>
  );
}