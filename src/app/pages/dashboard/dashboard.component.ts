import {Component, OnInit} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {AuthService} from "../../core/services/auth/auth.service";
import {UserService, User} from "../../core/services/user/user.service";
import {Router} from "@angular/router";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  currentUserStorageSize: string = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.currentUserStorageSize = this.formatBytes((user && user.storageSize) ? user.storageSize : 0);
    });
  }

  formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error logging out:', error);
      // Handle error (e.g., show error message to user)
    }
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  navigateToUpload() {
    this.router.navigate(['/upload']);
  }

  navigateToQRCode() {
    this.router.navigate(['/create-qr-code']);
  }
}

