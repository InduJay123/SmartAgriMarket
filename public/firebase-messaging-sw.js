importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBFOLmuc8Kvdo47qEvN8Oq2Di12ZtSZwNQ",
  authDomain: "smartagrialert.firebaseapp.com",
  projectId: "smartagrialert",
  storageBucket: "smartagrialert.firebasestorage.app",
  messagingSenderId: "71616709826",
  appId: "1:71616709826:web:01b02522134051af4d275b",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
