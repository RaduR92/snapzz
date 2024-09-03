import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  imports: [
 IonicModule, FormsModule,
  ],
  standalone: true
})
export class ForgotPasswordComponent {
  email: string = '';

  resetPassword() {
    // Implement password reset logic here
    console.log('Reset password for', this.email);
  }
}
