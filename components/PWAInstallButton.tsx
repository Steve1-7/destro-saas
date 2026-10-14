'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

function isAppleMobileDevice() {
  return (
    /iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

export default function PWAInstallButton() {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [installError, setInstallError] = useState('');

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (isStandalone) return;

    setShowInstallButton(isAppleMobileDevice());

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
      setShowInstallButton(true);
    };
    const handleInstalled = () => {
      setInstallPrompt(null);
      setShowInstallButton(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  async function installApp() {
    if (!installPrompt) {
      setShowInstructions(true);
      return;
    }

    setInstallError('');
    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === 'accepted') setShowInstallButton(false);
      setInstallPrompt(null);
    } catch (error) {
      console.error('[pwa] Install prompt failed', error);
      setInstallError('The install prompt could not be opened. Use your browser menu to install SYNTRA.');
      setInstallPrompt(null);
    }
  }

  if (!showInstallButton) return null;

  return (
    <>
      <button
        type="button"
        onClick={installApp}
        className="fixed z-30 flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium shadow-lg"
        style={{
          background: 'var(--bg2)',
          borderColor: 'var(--border2)',
          color: 'var(--accent)',
          bottom: 'calc(1rem + env(safe-area-inset-bottom))',
          right: 'calc(1rem + env(safe-area-inset-right))',
        }}
      >
        <Download size={16} />
        Install SYNTRA
      </button>

      {showInstructions && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setShowInstructions(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="install-title"
            className="w-full max-w-sm rounded-2xl border p-5 shadow-2xl"
            style={{ background: 'var(--bg1)', borderColor: 'var(--border2)' }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between gap-4">
              <h2 id="install-title" className="font-display text-lg font-semibold">Install SYNTRA</h2>
              <button
                type="button"
                aria-label="Close install instructions"
                onClick={() => setShowInstructions(false)}
                className="rounded-lg p-2"
                style={{ color: 'var(--text2)' }}
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text2)' }}>
              { isAppleMobileDevice()
                ? 'Tap Share in Safari, then choose Add to Home Screen.'
                : 'Open your browser menu and choose Install app or Add to Home Screen.'}
            </p>
          </section>
        </div>
      )}

      {installError && (
        <p
          role="alert"
          className="fixed bottom-16 right-4 z-40 max-w-xs rounded-lg border p-3 text-xs shadow-lg"
          style={{ background: 'var(--bg2)', borderColor: 'var(--border2)', color: 'var(--text)' }}
        >
          {installError}
        </p>
      )}
    </>
  );
}
