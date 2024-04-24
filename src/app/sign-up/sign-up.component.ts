import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['../login/login.component.css']
})
export class SignUpComponent implements OnInit {
  signUpForm!: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router,private toast: HotToastService) { }


  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      firstname: ['',[ Validators.required, Validators.minLength(3)]], // Define firstname control
      lastname: ['', [Validators.required, Validators.minLength(3)]],  // Define lastname control
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  
  register(): void {
    if (this.signUpForm.valid) {
      const firstname = this.signUpForm.get('firstname')?.value;
      const lastname = this.signUpForm.get('lastname')?.value;
      const email = this.signUpForm.get('email')?.value;
      const password = this.signUpForm.get('password')?.value;

    const bodyData = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password,
    };

    this.http.post('http://localhost:3000/user/create', bodyData).subscribe(
      (resultData: any) => {
        console.log(resultData);
         this.toast.success('Utilisateur enregistré avec succès!');
         this.signUpForm.reset();
      },
      (error) => {
        console.error('Error registering user:', error);
         this.toast.error("Erreur lors de l'enregistrement de l'utilisateur. Veuillez réessayer.");
      }
    );
  } else {
    // Mark form fields as touched to display error messages
    this.signUpForm.markAllAsTouched();
    this.toast.error("Veuillez remplir tous les champs correctement");
  }

}
}
