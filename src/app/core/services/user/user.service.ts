import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { switchMap, map } from 'rxjs/operators';

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {
    this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    ).subscribe(user => {
      return this.currentUserSubject.next(user ?? null);
    });
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  async updateUserProfile(user: Partial<User>): Promise<void> {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      await this.firestore.doc(`users/${currentUser.uid}`).update(user);
    }
  }
}
