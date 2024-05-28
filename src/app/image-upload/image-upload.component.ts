// // src/app/image-upload/image-upload.component.ts
// import { Component, OnInit } from '@angular/core';
// import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
// import { v4 as uuidv4 } from 'uuid';
// import { storage } from "../firebase.config";

// @Component({
//   selector: 'app-image-upload',
//   templateUrl: './image-upload.component.html',
//   styleUrls: ['./image-upload.component.css']
// })
// export class ImageUploadComponent implements OnInit {
//   fileUpload: File | null = null;
//   fileUrls: { url: string, type: string }[] = [];

//   constructor() { }

//   ngOnInit(): void {
//     this.loadFiles();
//   }

//   onFileSelected(event: Event): void {
//     const target = event.target as HTMLInputElement;
//     const file = target.files?.[0] || null;

//     if (file) {
//       const fileType = file.type;
//       const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

//       if (!allowedTypes.includes(fileType)) {
//         alert('Only images and PDF files are allowed.');
//         this.fileUpload = null;
//         target.value = ''; // Reset the file input
//       } else {
//         this.fileUpload = file;
//         console.log('File selected:', this.fileUpload);
//       }
//     }
//   }

//   uploadFile(): void {
//     if (!this.fileUpload) {
//       console.log('No file selected for upload');
//       return;
//     }

//     const fileType = this.fileUpload.type;
//     const fileExtension = fileType.split('/')[1];
//     const fileName = `${this.fileUpload.name}-${uuidv4()}.${fileExtension}`;
//     const fileRef = ref(storage, `uploads/${fileName}`);
//     console.log('Uploading file to:', fileRef.fullPath);

//     uploadBytes(fileRef, this.fileUpload).then(snapshot => {
//       console.log('File uploaded, getting download URL');
//       getDownloadURL(snapshot.ref).then(url => {
//         console.log('File available at', url);
//         this.fileUrls.push({ url, type: fileType });
//       }).catch(error => console.error('Error getting download URL', error));
//     }).catch(error => console.error('Error uploading file', error));
//   }

//   private loadFiles(): void {
//     const filesListRef = ref(storage, 'uploads/');
//     console.log('Loading files from:', filesListRef.fullPath);

//     listAll(filesListRef).then(response => {
//       response.items.forEach(item => {
//         getDownloadURL(item).then(url => {
//           const fileType = item.fullPath.split('.').pop();
//           const mimeType = fileType === 'pdf' ? 'application/pdf' : 'image/jpeg'; // Adjust mime type as needed
//           console.log('Found file at', url);
//           this.fileUrls.push({ url, type: mimeType });
//         }).catch(error => console.error('Error getting download URL for', item.fullPath, error));
//       });
//     }).catch(error => console.error('Error listing files', error));
//   }
// }
// src/app/image-upload/image-upload.component.ts
import { Component, OnInit } from '@angular/core';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { storage } from "../firebase.config";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit {
  fileUpload: File | null = null;
  fileUrls: { url: string, type: string }[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadFiles();
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0] || null;

    if (file) {
      const fileType = file.type;
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

      if (!allowedTypes.includes(fileType)) {
        alert('Only images and PDF files are allowed.');
        this.fileUpload = null;
        target.value = ''; // Reset the file input
      } else {
        this.fileUpload = file;
        console.log('File selected:', this.fileUpload);
      }
    }
  }

  uploadFile(): void {
    if (!this.fileUpload) {
      console.log('No file selected for upload');
      return;
    }

    const fileType = this.fileUpload.type;
    const fileExtension = fileType.split('/')[1];
    const fileName = `${this.fileUpload.name}-${uuidv4()}.${fileExtension}`;
    const fileRef = ref(storage, `uploads/${fileName}`);
    console.log('Uploading file to:', fileRef.fullPath);

    uploadBytes(fileRef, this.fileUpload).then(snapshot => {
      console.log('File uploaded, getting download URL');
      getDownloadURL(snapshot.ref).then(url => {
        console.log('File available at', url);
        this.fileUrls.push({ url, type: fileType });
        this.sendFileDataToServer(url, fileType); // Send URL to server after upload
      }).catch(error => console.error('Error getting download URL', error));
    }).catch(error => console.error('Error uploading file', error));
  }

  private loadFiles(): void {
    const filesListRef = ref(storage, 'uploads/');
    console.log('Loading files from:', filesListRef.fullPath);

    listAll(filesListRef).then(response => {
      response.items.forEach(item => {
        getDownloadURL(item).then(url => {
          const fileType = item.fullPath.split('.').pop();
          const mimeType = fileType === 'pdf' ? 'application/pdf' : 'image/jpeg'; // Adjust mime type as needed
          console.log('Found file at', url);
          this.fileUrls.push({ url, type: mimeType });
        }).catch(error => console.error('Error getting download URL for', item.fullPath, error));
      });
    }).catch(error => console.error('Error listing files', error));
  }

  private sendFileDataToServer(url: string, type: string): void {
    const postData = {
      url,
      type,
      otherData: 'Your additional data here' // Add any additional data you need to send
    };
    console.log('Sending file data to server:', postData);

    this.http.post('http://127.0.0.1:8000/api/your-endpoint', postData).subscribe(
      response => {
        console.log('File data sent to server successfully', response);
        alert('File uploaded and data sent to server successfully!');
      },
      error => {
        console.error('Error sending file data to server', error);
        alert('An error occurred while sending file data to the server. Please try again later.');
      }
    );
  }
}
