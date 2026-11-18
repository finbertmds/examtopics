import React, { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { finishGoogleLogin } from '../utils/loginExchange';
import { useLanguage } from '../contexts/LanguageContext';

const AuthCallback: React.FC = () => {
  const { acceptSession } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const exchange = useRef<ReturnType<typeof finishGoogleLogin> | null>(null);

  useEffect(() => {
    exchange.current ??= finishGoogleLogin();
    let active = true;
    void exchange.current.then((session) => {
      if (!active) return;
      if (session) acceptSession(session);
      navigate('/', { replace: true, state: session ? { authSuccess: true } : { authError: 'login_failed' } });
    });
    return () => { active = false; };
  }, [acceptSession, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-md w-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            {t('authenticating')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t('pleaseWait')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
