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

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
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
}

