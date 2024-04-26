import { HttpClient } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
// import * as jwt from 'jsonwebtoken';
// Use the jsonwebtoken package here


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


  
  redirectBasedOnRole(role: string) {
    switch (role) {
      case 'admin':
        this.router.navigate(['/admin']);
        break;
      case 'user':
        this.router.navigate(['/user']);
        break;
      default:
        this.router.navigate(['/login']);
        break;
    }
  }
  

  users: string[] = [];
  storedUsers: { email: string, role: string }[] = [];



  loadUsers(): void {
    this.http.get<any>('http://localhost:3000/user/getAll')
        .subscribe(
            (response) => {
                this.users = response.message.map((user: any) => {
                    return {
                        email: user.email, 
                        role: user.role 
                    };
                });

                console.log('users:', this.users);
                this.storeUsers(this.users);

              // Récupérer le jeton JWT depuis le stockage local
let jwt = localStorage.getItem('token');
console.log('jwt :'+jwt)
// Vérifier si le jeton JWT est présent
if (jwt) {
    // Diviser le jeton JWT pour obtenir les données de charge utile
    let jwtData = jwt.split('.')[1];

    // Décoder les données JSON de la charge utile du jeton JWT
    let decodedJwtJsonData = window.atob(jwtData);

    // Parser les données JSON décodées du jeton JWT
    let decodedJwtData = JSON.parse(decodedJwtJsonData);

    // Vérifier si l'utilisateur est un administrateur
    let role = decodedJwtData.role;
    this.redirectBasedOnRole(role);
    // console.log('jwtData'+jwtData)
    // console.log('decodedJwtJsonData'+decodedJwtJsonData)
    // console.log('decodedJwtData'+decodedJwtData)
    // console.log('role'+role)

    // Utiliser la valeur de isAdmin comme nécessaire
} else {
    // Gérer le cas où aucun jeton JWT n'est présent dans le stockage local
    console.error("Aucun jeton JWT n'est présent dans le stockage local.");
}




                // // Récupérer le chemin de redirection depuis la propriété de la requête
                // const redirectPath = response.redirectPath;

                // // Naviguer vers le chemin de redirection
                // this.router.navigate([redirectPath]);
            }
        );
}

  storeUsers(Users: any[]): void {
    this.storedUsers = Users;
    console.log('Stored Users:', this.storedUsers);
  }
  
  getRoleByEmail(email: string): string | undefined {
    const user = this.storedUsers.find((user: any) => user.email === email);
    return user ? user.role : undefined;
    
  }
  getToken(): string | null {
    return localStorage.getItem('token');
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
                const token = resultData.token;
                localStorage.setItem('token', token);
                console.log(token)
                this.loadUsers();
                // Récupérer le chemin de redirection depuis la réponse
                // const redirectPath = resultData.redirectPath;
                //  console.log(redirectPath)
                // // Naviguer vers le chemin de redirection
                // this.router.navigate([redirectPath]);

            } else {
                this.toast.error("Email ou mot de passe incorrect");
            }
        }, (error) => {
            console.error('Error logging in:', error);
            this.toast.error("Email ou mot de passe incorrect");
        });
    } else {
        this.loginForm.markAllAsTouched();
        this.toast.error("Veuillez remplir tous les champs correctement");
    }
}


  
  
   // -vérifier si il ya un changement de token-
            //// middleware->localStorage.getItem(token)
                        //dans le server 
            //verify si authentifié , //   const user = jwt.verify(token, 'secret') ;
             
           //if(user){
                      //navigate
           //}

}





