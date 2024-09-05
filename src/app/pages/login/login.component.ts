import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {IonicModule, NavController} from '@ionic/angular';
import { LoadingController, ToastController } from '@ionic/angular';

import {Router, RouterLink} from "@angular/router";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import {AuthService} from "../../core/services/auth/auth.service";
import {UserService} from "../../core/services/user/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    ReactiveFormsModule,
    RouterLink,
    IonicModule,
  ],
  standalone: true
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private router: Router,
    private userService: UserService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    this.userService.currentUser$.subscribe(user => {
      if (user) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  async login() {
    const loading = await this.loadingCtrl.create({
      message: 'Logging in...',
    });
    await loading.present();

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password)
      .then(() => {
        loading.dismiss();
        this.navCtrl.navigateRoot('/dashboard');
      })
      .catch(async (error) => {
        await loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: error.message,
          duration: 2000,
        });
        await toast.present();
      });
  }

  async signInWithGoogle() {
    try {
      await this.authService.signInWithGoogle();
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Google sign-in failed:', error);
      // Handle error (e.g., show error message to user)
    }
  }

  async signInWithFacebook() {
    try {
      await this.authService.signInWithFacebook();
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Facebook sign-in failed:', error);
      // Handle error (e.g., show error message to user)
    }
  }
}
