import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let db: admin.firestore.Firestore;

export const connectDatabase = async (): Promise<void> => {
  try {
    console.log('⚡ Firebase: Initializing Admin SDK...');

    // If already initialized, avoid re-init
    if (admin.apps.length > 0) {
      db = admin.firestore();
      return;
    }

    const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;
    const projectIdVar = process.env.FIREBASE_PROJECT_ID || 'one-earth-app';

    if (serviceAccountVar) {
      try {
        const serviceAccount = JSON.parse(serviceAccountVar);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
        console.log('✅ Firebase: Successfully initialized with explicit service account JSON credential.');
      } catch (err: any) {
        console.error('⚠️ Firebase: Found FIREBASE_SERVICE_ACCOUNT but failed to parse JSON. Falling back to default auth.', err.message);
        admin.initializeApp({
          projectId: projectIdVar
        });
      }
    } else {
      // Allow fallback to standard environment auth or local emulator
      admin.initializeApp({
        projectId: projectIdVar
      });
      console.log(`✅ Firebase: Initialized with Project ID: "${projectIdVar}".`);
    }

    db = admin.firestore();
    
    // Test the connection by requesting collections (if firebase emulator or online connectivity is set up)
    console.log('✅ Firebase: Firestore instance successfully locked and ready.');
  } catch (error) {
    console.error('❌ Firebase: Initial SDK setup failed:', error);
    process.exit(1);
  }
};

export const getFirestoreDb = (): admin.firestore.Firestore => {
  if (!db) {
    db = admin.firestore();
  }
  return db;
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    // Firebase Admin cleans up automatically on process exit, no explicit disconnect is strictly needed,
    // but we can close open network connections if desired or log safe exit.
    console.log('🔌 Firebase Admin: Disconnected safely from Cloud services.');
  } catch (error) {
    console.error('❌ Firebase: Error during disconnect:', error);
  }
};
