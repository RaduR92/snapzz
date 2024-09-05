import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {IonicModule, NavController} from '@ionic/angular';
import { LoadingController, ToastController } from '@ionic/angular';

import {Router, RouterLink} from "@angular/router";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import {AuthService} from "../../core/services/auth/auth.service";
import {User, UserService} from "../../core/services/user/user.service";
import {QRCodeModule} from "angularx-qrcode";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.scss'],
  imports: [
    ReactiveFormsModule,
    RouterLink,
    IonicModule,
    QRCodeModule,
    NgIf
  ],
  standalone: true
})
export class QrcodeComponent implements OnInit {
  currentUser: User | null = null;
  userUrl: string = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  createQRCode() {
    const userID = this.currentUser && this.currentUser?.uid ? this.currentUser?.uid : '';
    this.userUrl = window.location.protocol + "//" + window.location.hostname + "/upload?user=" + userID;
    console.log(this.userUrl);
  }
}
