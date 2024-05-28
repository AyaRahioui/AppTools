import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})

export class ResultComponent implements OnInit {
  @Input() isAdminView: boolean = false;
  resultForm: FormGroup;
  submitted: boolean = false;
  showForm: boolean = false;
  isUpdateMode: boolean = false;
  ResultArray: any[] = [];
  isResultLoaded: boolean = false;
  currentResultID: string = "";

  constructor(
    private http: HttpClient, 
    private toast: HotToastService,
    private fb: FormBuilder
  ) {
    this.resultForm = this.fb.group({
      result: ['', [Validators.required, Validators.pattern(/^r\d+$/)]]
    });
  }

  ngOnInit(): void {
    this.getAllResult();
  }

  getAllResult(): void {
    this.http.get("http://127.0.0.1:8000/api/result").subscribe((resultData: any) => {
      this.isResultLoaded = true;
      this.ResultArray = resultData;
    });
  }

  register(): void {
    let bodyData = {
      "name": this.resultForm?.get('result')?.value
    };

    this.http.post("http://127.0.0.1:8000/api/result", bodyData, { responseType: 'text' }).subscribe(() => {
      this.toast.success('Résultat créé avec succès!');
      this.getAllResult();
      this.resetForm();
      this.toggleForm();
    });
  }

  setUpdate(data: any): void {
    this.showForm = true;
    this.resultForm?.patchValue({ result: data.name });
    this.currentResultID = data.id;
    this.isUpdateMode = true;
  }

  UpdateRecords(): void {
    let bodyData = {
      "id": this.currentResultID,
      "name": this.resultForm?.get('result')?.value
    };

    this.http.put(`http://127.0.0.1:8000/api/result/${this.currentResultID}`, bodyData).subscribe(() => {
      this.toast.success('Résultat modifié avec succès!');
      this.getAllResult();
      this.resetForm();
      this.toggleForm();
    });
  }

  save(): void {
    this.submitted = true;
    if (this.resultForm?.invalid) {
      return;
    }

    if (this.isUpdateMode) {
      this.UpdateRecords();
    } else {
      this.register();
    }
  }

  setDelete(data: any): void {
    this.http.delete(`http://127.0.0.1:8000/api/result/${data.id}`, { responseType: 'text' }).subscribe(() => {
      this.toast.success('Résultat supprimé avec succès!');
      this.getAllResult();
    });
  }

  resetForm(): void {
    this.resultForm?.reset();
    this.submitted = false;
    this.isUpdateMode = false;
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  // Implement the onSubmit method
  onSubmit(): void {
    this.save();
  }

  // Implement the onReset method
  onReset(): void {
    this.resetForm();
  }
}
