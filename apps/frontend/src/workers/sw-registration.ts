export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/',
      });

      console.log('Service Worker registered:', registration);

      if ('sync' in registration) {
        await registration.sync.register('sync-score-queue');
      }

      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

