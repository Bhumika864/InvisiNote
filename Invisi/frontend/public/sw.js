self.addEventListener("push", function (event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "InvisiNotes Notification";
  const options = {
    body: data.body || "You have a new Note waiting to be revealed!",
    icon: "/favicon.ico",
    data: {
      url: data.data && data.data.url ? data.data.url : "/",
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification click
self.addEventListener("notificationclick", function (event) {
  console.log("[Service Worker] Notification click received");
  event.waitUntil(
    clients.openWindow(event.notification.data.url)

  );
});
