import { Routes } from '@angular/router';
import { AuthGuard} from "./core/guards/auth.guard";

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [AuthGuard] },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
  { path: 'forgot-password', loadComponent: () => import('./pages/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
  { path: 'profile', loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent), canActivate: [AuthGuard] },
  { path: 'upload', loadComponent: () => import('./pages/upload-photos/upload-photos.component').then(m => m.ImageUploadComponent) },
  { path: 'create-qr-code', loadComponent: () => import('./pages/qrcode/qrcode.component').then(m => m.QrcodeComponent), canActivate: [AuthGuard] },
];
