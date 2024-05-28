import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { storage } from "../firebase.config";

@Component({
  selector: 'app-evaluate',
  templateUrl: './evaluate.component.html',
  styleUrls: ['./evaluate.component.css', '../show-res/show-res.component.scss', '../result/result.component.css']
})
export class EvaluateComponent implements OnInit {
  submitted: boolean = false;
  showForm: boolean = false;
  isUpdateMode = false;
  EvaluateArray: any[] = [];
  isEvaluateLoaded = false;
  codeRes: string = "";
  descriptif: string = "";
  label: string = "";
  plan: string = "";
  currentEvaluateID = "";
  fileUploads: File[] = [];
  pdfUrl: string = "";
  imgUrls: string[] = [];
  photoModalVisible: boolean = false;
  currentPhotos: string[] = [];

  constructor(private http: HttpClient, private toast: HotToastService) {
    this.getAllEvaluate();
  }

  ngOnInit(): void {}

  getAllEvaluate() {
    this.http.get("http://127.0.0.1:8000/api/evaluate").subscribe((resultData: any) => {
      this.isEvaluateLoaded = true;
      this.EvaluateArray = resultData.map((evaluation: any) => {
        if (evaluation.imgs) {
          evaluation.imgs = JSON.parse(evaluation.imgs); // Deserialize imgs
        }
        return evaluation;
      });
    });
  }

  register() {
    let bodyData = {
      "codeRes": this.codeRes,
      "descriptif": this.descriptif,
      "label": this.label,
      "plan": this.plan,
      "pdf": this.pdfUrl,
      "imgs": JSON.stringify(this.imgUrls)
    };

    this.http.post("http://127.0.0.1:8000/api/evaluate", bodyData, { responseType: 'json' }).subscribe((resultData: any) => {
      this.toast.success('Résultat créé avec succès!');
      this.getAllEvaluate();
      this.reset();
    });
    this.toggleForm();
  }

  UpdateRecords() {
    let bodyData = {
      "id": this.currentEvaluateID,
      "codeRes": this.codeRes,
      "descriptif": this.descriptif,
      "label": this.label,
      "plan": this.plan,
      "pdf": this.pdfUrl,
      "imgs": JSON.stringify(this.imgUrls)
    };

    this.http.put("http://127.0.0.1:8000/api/evaluate" + "/" + this.currentEvaluateID, bodyData, { responseType: 'json' }).subscribe((resultData: any) => {
      this.toast.success('Résultat modifié avec succès!');
      this.getAllEvaluate();
      this.toggleForm();
    });
  }

  save() {
    if (this.fileUploads.length > 0) {
      this.uploadFiles().then(() => {
        if (this.isUpdateMode) {
          this.UpdateRecords();
        } else {
          this.register();
        }
      });
    } else {
      if (this.isUpdateMode) {
        this.UpdateRecords();
      } else {
        this.register();
      }
    }
  }

  uploadFiles(): Promise<void> {
    return new Promise((resolve, reject) => {
      const uploadPromises = this.fileUploads.map(file => {
        const fileType = file.type;
        const fileExtension = fileType.split('/')[1];
        const fileName = `${file.name}-${uuidv4()}.${fileExtension}`;
        const fileRef = ref(storage, `uploads/${fileName}`);

        return uploadBytes(fileRef, file).then(snapshot => {
          return getDownloadURL(snapshot.ref).then(url => {
            if (fileType === 'application/pdf') {
              this.pdfUrl = url;
            } else {
              this.imgUrls.push(url);
            }
          });
        });
      });

      Promise.all(uploadPromises).then(() => resolve()).catch(error => reject(error));
    });
  }

  setUpdate(data: any) {
    this.showForm = true;
    this.codeRes = data.codeRes;
    this.descriptif = data.descriptif;
    this.label = data.label;
    this.plan = data.plan;
    this.currentEvaluateID = data.id;
    this.pdfUrl = data.pdf;
    this.imgUrls = data.imgs || [];
    this.isUpdateMode = true;
  }

  setDelete(data: any) {
    this.http.delete("http://127.0.0.1:8000/api/evaluate" + "/" + data.id, { responseType: 'text' }).subscribe(() => {
      this.toast.success('Résultat supprimé avec succès!');
      this.getAllEvaluate();
      this.reset();
    });
  }

  reset() {
    this.codeRes = "";
    this.descriptif = "";
    this.label = "";
    this.plan = "";
    this.pdfUrl = "";
    this.imgUrls = [];
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.reset();
    }
    this.submitted = false;
    this.isUpdateMode = false;
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = Array.from(target.files || []);
    
    const newFileUploads = files.filter(file => {
      const fileType = file.type;
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      return allowedTypes.includes(fileType);
    });

    const pdfFiles = newFileUploads.filter(file => file.type === 'application/pdf');
    const imageFiles = newFileUploads.filter(file => file.type !== 'application/pdf');

    if (pdfFiles.length > 1) {
      alert('Only one PDF file is allowed.');
      this.fileUploads = [...imageFiles, pdfFiles[0]];
    } else if (imageFiles.length > 7) {
      alert('You can upload a maximum of 7 images.');
      this.fileUploads = [...pdfFiles, ...imageFiles.slice(0, 7)];
    } else {
      this.fileUploads = newFileUploads;
    }
  }

  openPhotoModal(imgs: string[]): void {
    this.currentPhotos = imgs;
    this.photoModalVisible = true;
  }

  closePhotoModal(): void {
    this.photoModalVisible = false;
    this.currentPhotos = [];
  }
}
