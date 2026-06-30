// plugins/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging,isSupported } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyCfOfrWJhj7ZnfroIb6jRs5XBcwwUminIM",
    authDomain: "firbaseprojectpetoman.firebaseapp.com",
    projectId: "firbaseprojectpetoman",
    storageBucket: "firbaseprojectpetoman.firebasestorage.app",
    messagingSenderId: "646062800359",
    appId: "1:646062800359:web:954ff45bd15ab8b990d142",
    measurementId: "G-GC5ZS59NDF"
};

// راه‌اندازی فایربیس
const app = initializeApp(firebaseConfig);
// 2. تعریف اولیه متغیر برای جلوگیری از خطای Export
let messaging = null;
let supported = false;

// 3. بررسی پشتیبانی مرورگر (این تابع آسنکرون است)
try {
    supported = await isSupported();

    if (supported) {
        // 4. ایجاد نمونه messaging فقط اگر پشتیبانی شود
        messaging = getMessaging(app);
    }
} catch (error) {
    console.error("Error checking Firebase Messaging support:", error);
}

export { messaging, supported, app };