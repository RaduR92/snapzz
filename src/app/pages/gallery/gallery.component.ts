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
import {NgIf, NgOptimizedImage} from "@angular/common";
import { GalleriaModule } from 'primeng/galleria';
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {catchError, map, switchMap} from "rxjs/operators";
import {Observable, of} from "rxjs";


interface FileItem {
  name: string;
  url: string;
  type: string;
}


@Component({
  selector: 'app-qrcode',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  imports: [
    ReactiveFormsModule,
    RouterLink,
    IonicModule,
    QRCodeModule,
    NgIf,
    GalleriaModule,
    NgOptimizedImage
  ],
  standalone: true
})


export class GalleryComponent implements OnInit {
  currentUser: User | null = null;
  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];

  images: Observable<FileItem[]> = of([]);
  error: string | null = null;


  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private storage: AngularFireStorage
  ) {
  }

  ngOnInit() {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.getUserImages();
    console.log(this.images);
  }


  private getUserImages() {
    const userFolder = `uploads/${this.currentUser?.uid}/`;
    this.images = this.storage.ref(userFolder).listAll().pipe(
      switchMap(result => {
        const fileObservables = result.items.map(item =>
          item.getDownloadURL().then(url => ({
            name: item.name,
            url: url,
            type: this.getFileType(item.name)
          }))
        );
        return Promise.all(fileObservables);
      }),
      catchError(error => {
        console.error('Error fetching user files:', error);
        this.error = 'Failed to load user files. Please try again later.';
        return of([]);
      })
    );
  }

  getFileType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension) {
      if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
        return 'image';
      } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
        return 'video';
      } else {
        return 'other';
      }
    } else {
      return 'image';
    }
  }
}
