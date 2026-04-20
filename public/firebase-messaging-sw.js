importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCof0oEeLWYsrwEka9kK3reM3FvbAosYf0",
  authDomain: "prepflow-89210.firebaseapp.com",
  projectId: "prepflow-89210",
  messagingSenderId: "430436885461",
  appId: "1:430436885461:web:a5255e21e5f3c56313935c"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
  });
});