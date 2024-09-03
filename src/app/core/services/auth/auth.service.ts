import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { User }  from "../user/user.service";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import firebase from "firebase/compat/app";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<any>;

  constructor(private afAuth: AngularFireAuth,  private firestore: AngularFirestore) {
    this.user$ = this.afAuth.authState;
  }

  async login(email: string, password: string): Promise<any> {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);
      return result;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  async register(email: string, password: string): Promise<any> {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
      // Create user document in Firestore
      if (result.user) {
        console.log(result.user.uid);
        await this.firestore.doc(`users/${result.user.uid}`).set({
          uid: result.user.uid,
          email: result.user.email,
        });
      }
      return result;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  async signInWithGoogle(): Promise<any> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const credential = await this.afAuth.signInWithPopup(provider);
      await this.updateUserData(credential.user);
      return credential;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  }

  async signInWithFacebook(): Promise<any> {
    try {
      const provider = new firebase.auth.FacebookAuthProvider();
      const credential = await this.afAuth.signInWithPopup(provider);
      await this.updateUserData(credential.user);
      return credential;
    } catch (error) {
      console.error('Error signing in with Facebook:', error);
      throw error;
    }
  }

  private async updateUserData(user: firebase.User | null): Promise<void> {
    if (user) {
      const userRef = this.firestore.doc(`users/${user.uid}`);
      const data = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      };
      await userRef.set(data, { merge: true });
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }
}
