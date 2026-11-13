// ============================================
// Auth Service - Firebase + Offline/Demo Support
// ============================================

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, isFirebaseConfigured } from './firebase';
import { User } from '../types';

const LOCAL_USER_KEY = '@budget_app_current_user';
let localListeners: Array<(user: User | null) => void> = [];

export const authService = {
  // Sign up with email & password
  async signUp(email: string, password: string, displayName: string): Promise<User> {
    if (isFirebaseConfigured()) {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName });
      const mapped = mapFirebaseUser(credential.user);
      await AsyncStorage.setItem(LOCAL_USER_KEY, JSON.stringify(mapped));
      return mapped;
    }

    // Local / Demo Mode fallback
    const mockUser: User = {
      uid: 'user_' + Date.now(),
      email,
      displayName: displayName || 'Demo User',
      photoURL: null,
      createdAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(LOCAL_USER_KEY, JSON.stringify(mockUser));
    notifyLocalListeners(mockUser);
    return mockUser;
  },

  // Sign in with email & password
  async signIn(email: string, password: string): Promise<User> {
    if (isFirebaseConfigured()) {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const mapped = mapFirebaseUser(credential.user);
      await AsyncStorage.setItem(LOCAL_USER_KEY, JSON.stringify(mapped));
      return mapped;
    }

    // Local / Demo Mode fallback
    const saved = await AsyncStorage.getItem(LOCAL_USER_KEY);
    let user: User;
    if (saved) {
      user = JSON.parse(saved);
      user.email = email;
    } else {
      user = {
        uid: 'user_demo_123',
        email,
        displayName: 'Senior Dev',
        photoURL: null,
        createdAt: new Date().toISOString(),
      };
    }
    await AsyncStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
    notifyLocalListeners(user);
    return user;
  },

  // Instant Demo login
  async signInDemo(): Promise<User> {
    const demoUser: User = {
      uid: 'user_demo_senior_dev',
      email: 'seniordev@budgetapp.io',
      displayName: 'Senior Dev',
      photoURL: null,
      createdAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(LOCAL_USER_KEY, JSON.stringify(demoUser));
    notifyLocalListeners(demoUser);
    return demoUser;
  },

  // Sign out
  async signOut(): Promise<void> {
    if (isFirebaseConfigured()) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        console.warn('Firebase signOut warning:', e);
      }
    }
    await AsyncStorage.removeItem(LOCAL_USER_KEY);
    notifyLocalListeners(null);
  },

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    if (isFirebaseConfigured()) {
      return onAuthStateChanged(auth, (firebaseUser) => {
        callback(firebaseUser ? mapFirebaseUser(firebaseUser) : null);
      });
    }

    // Offline / Local mode
    localListeners.push(callback);
    AsyncStorage.getItem(LOCAL_USER_KEY).then((data) => {
      if (data) {
        try {
          callback(JSON.parse(data));
        } catch {
          callback(null);
        }
      } else {
        callback(null);
      }
    });

    return () => {
      localListeners = localListeners.filter((l) => l !== callback);
    };
  },
};

function notifyLocalListeners(user: User | null) {
  localListeners.forEach((fn) => fn(user));
}

function mapFirebaseUser(user: FirebaseUser): User {
  return {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || 'User',
    photoURL: user.photoURL,
    createdAt: user.metadata.creationTime || new Date().toISOString(),
  };
}
