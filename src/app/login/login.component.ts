import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  UserArray: any[] = [];
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private toast: HotToastService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }



  login() {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;

      const bodyData = {
        email: email,
        password: password,
      };

      this.http.post("http://localhost:3000/user/login", bodyData).subscribe((resultData: any) => {
        if (resultData.status) {
          this.toast.success('Connexion réussie!');
          this.router.navigateByUrl('/user');
        } else {
          this.toast.error("Email ou mot de passe incorrect");
        }
      },
      (error) => {
        console.error('Error logging in:', error);
        this.toast.error("Email ou mot de passe incorrect");
      });
    } else {
      // Mark form fields as touched to display error messages
      this.loginForm.markAllAsTouched();
      this.toast.error("Veuillez remplir tous les champs correctement");
    }
  }


}
