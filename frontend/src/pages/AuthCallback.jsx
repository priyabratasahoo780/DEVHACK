import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, Sprout } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      if (!supabase) {
        // Demo mode — just go home
        navigate('/', { replace: true });
        return;
      }

      try {
        // For PKCE flow, exchange the code in the URL for a session
        const { error: sessionError } = await supabase.auth.exchangeCodeForSession(
          window.location.href
        );

        if (sessionError) {
          console.error('Auth callback error:', sessionError);
          setError(sessionError.message);
          setTimeout(() => navigate('/login', { replace: true }), 2000);
          return;
        }

        // Session is now stored — redirect to app
        navigate('/', { replace: true });
      } catch (err) {
        console.error('Unexpected auth callback error:', err);
        setError('Authentication failed. Redirecting to login...');
        setTimeout(() => navigate('/login', { replace: true }), 2000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8faf8] dark:bg-gray-950 gap-4">
      <Helmet>
        <title>Authenticating... | AgriSaar</title>
        <meta name="description" content="Verifying your identity and setting up your AgriSaar session." />
      </Helmet>
      {error ? (
        <>
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center">
            <Sprout className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-red-600 dark:text-red-400 font-medium text-sm text-center max-w-xs">
            {error}
          </p>
          <p className="text-gray-400 text-xs">Redirecting to login...</p>
        </>
      ) : (
        <>
          <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400 font-medium text-sm">
            Signing you in...
          </p>
        </>
      )}
    </div>
  );
}
