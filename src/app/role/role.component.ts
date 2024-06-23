import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: [
    '../plan/plan.component.css',
    '../show-res/show-res.component.scss',
    '../result/result.component.css'
  ]
})
export class RoleComponent implements OnInit {
  roleForm: FormGroup;
  isRoleLoaded: boolean = false;
  submitted: boolean = false;
  showForm: boolean = false;
  isUpdateMode: boolean = false;
  roleArray: any[] = [];
  currentRoleID: string = "";

  constructor(
    private http: HttpClient, 
    private toast: HotToastService,
    private fb: FormBuilder
  ) {
    this.roleForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getAllRoles();
  }

  getAllRoles(): void {
    this.http.get("http://127.0.0.1:8000/api/user").subscribe((roleData: any) => {
      this.isRoleLoaded = true;
      this.roleArray = roleData.users;
    });
  }

  register(): void {
    let bodyData = this.roleForm.value;

    this.http.post("http://127.0.0.1:8000/api/signup", bodyData, { responseType: 'json' }).subscribe(() => {
      this.toast.success('Utilisateur créé avec succès!');
      this.resetForm();
      this.getAllRoles();
    });
    this.toggleForm();
  }

  setUpdate(data: any): void {
    this.showForm = true;
    this.currentRoleID = data.id;
    this.isUpdateMode = true;

    this.roleForm = this.fb.group({
      firstname: [data.firstname, Validators.required],
      lastname: [data.lastname, Validators.required],
      email: [data.email, [Validators.required, Validators.email]],
      password: [''],
      role: [data.role, Validators.required]
    });
  }
  updateRecords(): void {
    let bodyData = { ...this.roleForm.value };
  
    if (!bodyData.password) {
      delete bodyData.password; // Remove password if not being updated
    }
  
    this.http.put('http://127.0.0.1:8000/api/user/' + this.currentRoleID, bodyData).subscribe(
      (resultData: any) => {
        console.log('Payload for update:', bodyData);
        if (resultData.user.role === bodyData.role) {
          this.toast.success('Utilisateur modifié avec succès!');
        } else {
          this.toast.warning('Le rôle de l\'utilisateur n\'a pas été mis à jour.');
        }
        this.getAllRoles(); // Refresh the list
        this.resetForm();
        this.toggleForm();
      },
      error => {
        console.error('Error updating record:', error);
        this.toast.error('Erreur lors de la modification de l\'utilisateur.');
      }
    );
  }
  
  save(): void {
    this.submitted = true;
    if (this.roleForm.invalid) {
      return;
    }

    if (this.isUpdateMode) {
      this.updateRecords();
    } else {
      this.register();
    }
  }

  setDelete(data: any): void {
    this.http.delete(`http://127.0.0.1:8000/api/user/${data.id}`, { responseType: 'text' }).subscribe(() => {
      this.toast.success('Utilisateur supprimé avec succès!');
      this.getAllRoles();
    });
  }

  resetForm(): void {
    this.roleForm.reset();
    this.submitted = false;
    this.isUpdateMode = false;

    // Reinitialize form to clear any conditional validation
    this.roleForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      role: ['', Validators.required]
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }
}
