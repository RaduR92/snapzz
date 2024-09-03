import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { UserService, User} from "../../core/services/user/user.service";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  async updateProfile() {
    if (this.currentUser) {
      try {
        await this.userService.updateUserProfile({
          displayName: this.currentUser.displayName
        });
        console.log('Profile updated successfully');
        // Show success message to user
      } catch (error) {
        console.error('Error updating profile:', error);
        // Show error message to user
      }
    }
  }
}
