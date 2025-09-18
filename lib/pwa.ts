// PWA utility functions
import type { BeforeInstallPromptEvent } from '@/types/pwa';

export const isPWASupported = (): boolean => {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator;
};

export const isStandalone = (): boolean => {
  return typeof window !== 'undefined' &&
    ((window.navigator as {standalone?: boolean}).standalone === true ||
    window.matchMedia('(display-mode: standalone)').matches);
};

export const registerSW = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!isPWASupported()) {
    console.log('Service Worker not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered:', registration);
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
};

export const unregisterSW = async (): Promise<boolean> => {
  if (!isPWASupported()) return false;

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      const result = await registration.unregister();
      console.log('Service Worker unregistered:', result);
      return result;
    }
    return false;
  } catch (error) {
    console.error('Service Worker unregistration failed:', error);
    return false;
  }
};

// Cache management
export const clearCache = async (): Promise<void> => {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('All caches cleared');
  }
};

// Install prompt management
let deferredPrompt: BeforeInstallPromptEvent | null = null;

export const setInstallPrompt = (e: BeforeInstallPromptEvent) => {
  deferredPrompt = e;
};

export const showInstallPrompt = async (): Promise<boolean> => {
  if (!deferredPrompt) return false;

  try {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    deferredPrompt = null;
    return outcome === 'accepted';
  } catch (error) {
    console.error('Install prompt error:', error);
    return false;
  }
};

export const canShowInstallPrompt = (): boolean => {
  return deferredPrompt !== null;
};
