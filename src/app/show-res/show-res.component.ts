import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-show-res',
  templateUrl: './show-res.component.html',
  styleUrls: ['../result/result.component.css', './show-res.component.scss']
})
export class ShowResComponent implements OnInit {
  constructor(private http: HttpClient, private toast: HotToastService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.showPageById(id);
        this.getAllActivity();
      }
    });
  }

  showPageById(id: string) {
    console.log('Naviguer vers la page avec l\'ID :', id);
    // Implement actual navigation or loading logic here
  }

  submitted: boolean = false;
  showForm: boolean = false;
  months: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  isUpdateMode = false;

  activityArray: any[] = [];
  isActivityLoaded = false;

  name: string = "";
  description: string = "";
  dueDate: number[] = [];
  label: string = "";
  result_id: string = "";

  currentActivityID = "";

  getId() {
    return this.route.snapshot.paramMap.get('id');
  }

  getAllActivity() {
    const resultId = this.getId();
    if (resultId) {
      console.log(resultId + " resultId");
      this.http.get<any[]>(`http://127.0.0.1:8000/api/activity?result_id=${resultId}`)
        .subscribe({
          next: (activityData: any[]) => {
            this.isActivityLoaded = true;
            console.log(activityData);
            this.activityArray = activityData;
          },
          error: (err) => {
            console.error('Error loading activities', err);
            this.toast.error('Erreur lors du chargement des activités.');
          }
        });
    }
  }

  register() {
    const resultId = this.getId();
    let bodyData = {
      "name": this.name,
      "description": this.description,
      "dueDate": this.dueDate,
      "label": this.label,
      "result_id": resultId,
    };

    this.http.post("http://127.0.0.1:8000/api/activity", bodyData, { responseType: 'text' }).subscribe({
      next: (activityData: any) => {
        console.log(activityData);
        this.toast.success('Résultat créé avec succés!');
        this.getAllActivity();
        this.reset();
      },
      error: (err) => {
        console.error('Error creating activity', err);
        this.toast.error('Erreur lors de la création de l\'activité.');
      }
    });
    this.toggleForm();
  }

  setUpdate(data: any) {
    const resultId = this.getId();
    if (resultId) {
      this.showForm = true;
      this.name = data.name;
      this.description = data.description;
      this.dueDate = data.dueDate;
      this.label = data.label;
      this.result_id = resultId;
      this.currentActivityID = data.id;
      this.isUpdateMode = true;
    }
  }

  UpdateRecords() {
    const resultId = this.getId();
    let bodyData = {
      "id": this.currentActivityID,
      "name": this.name,
      "description": this.description,
      "dueDate": this.dueDate,
      "label": this.label,
      "result_id": resultId,
    };

    this.http.put(`http://127.0.0.1:8000/api/activity/${this.currentActivityID}`, bodyData).subscribe({
      next: (activityData: any) => {
        console.log(activityData);
        this.toast.success('Résultat modifié avec succés!');
        this.getAllActivity();
        this.toggleForm();
      },
      error: (err) => {
        console.error('Error updating activity', err);
        this.toast.error('Erreur lors de la modification de l\'activité.');
      }
    });
  }

  save() {
    if (this.isUpdateMode) {
      this.UpdateRecords();
    } else {
      this.register();
    }
  }

  setDelete(data: any) {
    this.http.delete(`http://127.0.0.1:8000/api/activity/${data.id}`, { responseType: 'text' }).subscribe({
      next: (activityData: any) => {
        console.log(activityData);
        this.toast.success('Résultat supprimé avec succés!');
        this.getAllActivity();
        this.reset();
      },
      error: (err) => {
        console.error('Error deleting activity', err);
        this.toast.error('Erreur lors de la suppression de l\'activité.');
      }
    });
  }

  reset() {
    this.name = "";
    this.description = "";
    this.label = "";
    this.dueDate = [];
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    this.reset();
    this.submitted = false;
    this.isUpdateMode = false;
  }

  submitForm(): void {
    console.log('Formulaire soumis!');
    this.cancelForm();
  }

  cancelForm(): void {
    this.showForm = false;
    this.reset();
  }
}
