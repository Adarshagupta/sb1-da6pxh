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
          console.log('beforeinstallprompt event fired');
        });

        window.addEventListener('appinstalled', (e) => {
          console.log('PWA was installed');
        });

      } catch (error) {
        console.error('ServiceWorker registration failed:', error);
      }
    });
  } else {
    console.log('Service workers are not supported');
  }
} 