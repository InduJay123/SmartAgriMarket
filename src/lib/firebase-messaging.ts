import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBFOLmuc8Kvdo47qEvN8Oq2Di12ZtSZwNQ",
  authDomain: "smartagrialert.firebaseapp.com",
  projectId: "smartagrialert",
  storageBucket: "smartagrialert.firebasestorage.app",
  messagingSenderId: "71616709826",
  appId: "1:71616709826:web:01b02522134051af4d275b",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Get FCM token
export const getFcmToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: "BMk8DdwbQhndBEVa_fdlvlxlsrJsNzb4CZttO6UfBy4HqysjJ422J_APD3uJ8aDZLZsYmPzOzS0AAW-jAhEDd8Y",
    });
    return token;
  } catch (err) {
    console.error("FCM token error: ", err);
  }
};

// Listen to messages when app is in foreground
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export default messaging;
