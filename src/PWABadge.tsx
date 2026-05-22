import { useRegisterSW } from "virtual:pwa-register/react";

function PWABadge() {
  // check for updates every hour
  const period = 60 * 60 * 1000;

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      if (period <= 0) return;
      if (r?.active?.state === "activated") {
        registerPeriodicSync(period, swUrl, r);
      } else if (r?.installing) {
        r.installing.addEventListener("statechange", (e) => {
          const sw = e.target as ServiceWorker;
          if (sw.state === "activated") registerPeriodicSync(period, swUrl, r);
        });
      }
    },
  });

  function close() {
    setOfflineReady(false);
    setNeedRefresh(false);
  }

  return (
    <div
      className="fixed bottom-0 right-0 p-4 z-50 pointer-events-none"
      role="alert"
      aria-labelledby="toast-message"
    >
      {(offlineReady || needRefresh) && (
        <div className="bg-bg-secondary border border-border shadow-lg rounded-md p-3 pointer-events-auto flex items-center gap-3">
          <div className="text-sm text-text-primary">
            {offlineReady
              ? <span id="toast-message">App ready to work offline</span>
              : (
                <span id="toast-message">
                  New content available, click on reload button to update.
                </span>
              )}
          </div>
          <div className="flex gap-2">
            {needRefresh && (
              <button
                className="px-3 py-1.5 text-xs font-medium rounded-md bg-accent text-white hover:bg-accent-emphasis transition-colors cursor-pointer"
                onClick={() => updateServiceWorker(true)}
              >
                Reload
              </button>
            )}
            <button
              className="px-3 py-1.5 text-xs font-medium rounded-md border border-border text-text-primary hover:bg-bg-hover transition-colors cursor-pointer"
              onClick={() => close()}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PWABadge;

/**
 * This function will register a periodic sync check every hour, you can modify the interval as needed.
 */
function registerPeriodicSync(
  period: number,
  swUrl: string,
  r: ServiceWorkerRegistration,
) {
  if (period <= 0) return;

  setInterval(async () => {
    if ("onLine" in navigator && !navigator.onLine) return;

    const resp = await fetch(swUrl, {
      cache: "no-store",
      headers: {
        cache: "no-store",
        "cache-control": "no-cache",
      },
    });

    if (resp?.status === 200) await r.update();
  }, period);
}
