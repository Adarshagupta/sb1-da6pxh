export function registerPWA() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });
        console.log('ServiceWorker registration successful:', registration);

        // Add debug logging for PWA events
        window.addEventListener('beforeinstallprompt', (e) => {
          e.preventDefault(); // Prevent the mini-infobar from appearing on mobile
          console.log('beforeinstallprompt event fired');
          // Store the event for later use
          window.deferredPrompt = e;
          // Show your install button or UI element
          document.dispatchEvent(new Event('pwaInstallable'));
        });

        window.addEventListener('appinstalled', (e) => {
          console.log('PWA was installed');
          window.deferredPrompt = null;
          // Hide your install button or UI element
          document.dispatchEvent(new Event('pwaInstalled'));
        });

      } catch (error) {
        console.error('ServiceWorker registration failed:', error);
      }
    });
  } else {
    console.log('Service workers are not supported');
  }
}

// Add this to the global Window interface
declare global {
  interface Window {
    deferredPrompt: any;
  }
} 