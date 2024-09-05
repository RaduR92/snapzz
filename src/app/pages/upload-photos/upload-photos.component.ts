import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import {IonicModule} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import firebase from "firebase/compat";
import storage = firebase.storage;
import {Observable} from "rxjs";
import {user} from "@angular/fire/auth";
import {ActivatedRoute} from "@angular/router";
import {QRCodeModule} from "angularx-qrcode";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Component({
  selector: 'app-image-upload',
  templateUrl: './upload-photos.component.html',
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, CommonModule, ReactiveFormsModule, QRCodeModule],
})
export class ImageUploadComponent implements OnInit {
  uploadForm: FormGroup | undefined;
  selectedFiles: FileList | null = null;
  downloadURLs: string[] = [];
  uploadProgress: number = 0;
  isUploading: boolean = false;
  storageSize: number = 0;
  userID: string | null = '';

  constructor(
    private formBuilder: FormBuilder,
    private storage: AngularFireStorage,
    private route: ActivatedRoute,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    this.userID = this.route.snapshot.paramMap.get("user");
    this.route.queryParams
      .subscribe(params => {
          console.log(params); // { brand: "bmw" }
          this.userID = params['user']
        }
      );
    console.log(this.route.snapshot.paramMap);
    this.uploadForm = this.formBuilder.group({
      files: [null, Validators.required]
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = input.files;
      this.uploadForm?.patchValue({ files: this.selectedFiles });
    }
  }

  async onSubmit() {
    if (this.uploadForm?.valid && this.selectedFiles) {
      this.isUploading = true;
      this.downloadURLs = [];
      this.uploadProgress = 0;

      const totalFiles = this.selectedFiles.length;
      let completedUploads = 0;

      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.storageSize += this.selectedFiles[i].size;
        const file = this.selectedFiles[i];
        const filePath = `uploads/${this.userID}/${new Date().getTime()}_${file.name}`;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, file);

        task.percentageChanges().subscribe(progress => {
          if (progress) {
            const individualProgress = progress / totalFiles;
            this.uploadProgress = (completedUploads / totalFiles) * 100 + individualProgress;
          }
        });

        task.snapshotChanges().pipe(
          finalize(async () => {
            const downloadURL = await fileRef.getDownloadURL().toPromise();
             console.log(fileRef.getMetadata())
            this.downloadURLs.push(downloadURL);
            completedUploads++;
            if (completedUploads === totalFiles) {
              this.updateUserStorage();
              this.isUploading = false;
              this.uploadProgress = 100;
              console.log('All uploads completed');
            }
          })
        ).subscribe();
      }
    }
  }

  private async  updateUserStorage() {
    const userRef = this.firestore.doc(`users/${this.userID}`);
    const data = {
      storageSize: this.storageSize,
    };
    await userRef.set(data, { merge: true });
  }
}
