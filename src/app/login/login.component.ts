import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import * as jwt from 'jsonwebtoken';

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
    this.loadUsers();
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }


  // login() {
  //   if (this.loginForm.valid) {
  //     const email = this.loginForm.get('email')?.value;
  //     const password = this.loginForm.get('password')?.value;
  
  //     const bodyData = {
  //       email: email,
  //       password: password,
  //     };
  
  //     this.http.post("http://localhost:3000/user/login", bodyData).subscribe((resultData: any) => {
  //       if (resultData.status) {
  //         this.toast.success('Connexion réussie!');
  //         sessionStorage.setItem('token', resultData.token);
  //         sessionStorage.setItem('role', resultData.role);
  //         this.redirectBasedOnRole(resultData.role);
  //         console.log(resultData);
  //       } else {
  //         this.toast.error("Email ou mot de passe incorrect");
  //       }
  //     }, (error) => {
  //       console.error('Error logging in:', error);
  //       this.toast.error("Email ou mot de passe incorrect");
  //     });
  //   } else {
  //     // Mark form fields as touched to display error messages
  //     this.loginForm.markAllAsTouched();
  //     this.toast.error("Veuillez remplir tous les champs correctement");
  //   }
  // }
  
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
  
      // Vérifiez si l'email existe dans les utilisateurs stockés
     
      const role = this.getRoleByEmail(email) ;
     
      if (role) {
        const bodyData = {
          email: email,
          password: password,
        };
  /*
 
  
  
  */


        this.http.post("http://localhost:3000/user/login", bodyData).subscribe((resultData: any) => {
          if (resultData.status) {
            const token = resultData.token;
            this.toast.success('Connexion réussie!');
            console.log(token);
            //const user = JWT.verify(token,secret)  
        
            //cookie set (dans le )

            localStorage.setItem('token', token);
            
if (token) {
  try {
    const decodedToken = jwt.verify(token, 'votre_secret');
    console.log(decodedToken);
    // Ici, vous pouvez utiliser les informations du token décodé
  } catch (error) {
    console.error('Erreur de vérification du token :', error);
    // Gérer l'erreur de vérification du token
  }
} else {
  console.error('Token non trouvé dans le localStorage.');
  // Gérer le cas où le token n'est pas trouvé dans le localStorage
}

            // -vérifier si il ya un changement de token-
            //// middleware->localStorage.getItem(token)
                        //dans le server 
            //verify si authentifié , //   const user = jwt.verify(token, 'secret') ;
             
           //if(user){
                      //navigate
           //}

            this.redirectBasedOnRole(role);
          } else {
            this.toast.error("Email ou mot de passe incorrect");
          }
        }, (error) => {
          console.error('Error logging in:', error);
          this.toast.error("Email ou mot de passe incorrect");
        });
      } else {
        this.toast.error("Email non trouvé");
      }
    } else {
      // Marquez les champs du formulaire comme touchés pour afficher les messages d'erreur
      this.loginForm.markAllAsTouched();
      this.toast.error("Veuillez remplir tous les champs correctement");
    }
  }
  
  
  
}

  // login() {
  //   if (this.loginForm.valid) {
  //     const email = this.loginForm.get('email')?.value;
  //     const password = this.loginForm.get('password')?.value;

  //     this.http.post<any>("http://localhost:3000/user/login", { email, password })
  //       .pipe(
  //         tap((resultData: any) => {
  //           if (resultData.status) {
  //             sessionStorage.setItem('token', resultData.token);
  //             sessionStorage.setItem('role', resultData.role);
  //             this.redirectBasedOnRole(resultData.role);
  //             console.log(resultData.role);
  //           } else {
  //             this.toast.error("Email ou mot de passe incorrect");
  //           }
  //         })
  //       )
  //       .subscribe(
  //         () => { },
  //         (error) => {
  //           console.error('Error logging in:', error);
  //           this.toast.error("Erreur lors de la connexion");
  //         }
  //       );
  //   } else {
  //     this.loginForm.markAllAsTouched();
  //     this.toast.error("Veuillez remplir tous les champs correctement");
  //   }
  // }




  // User.findOne({ email: email }, (err, user) => {
  //   if (err) {
  //     return res.status(500).json({ status: false, message: "Erreur lors de la recherche de l'utilisateur." });
  //   }
  //   if (!user) {
  //     return res.status(401).json({ status: false, message: "Email ou mot de passe incorrect." });
  //   }

  //   // Vérification du mot de passe
  //   if (!user.isValidPassword(password)) {
  //     return res.status(401).json({ status: false, message: "Email ou mot de passe incorrect." });
  //   }

  //   // Si l'utilisateur est trouvé et le mot de passe est correct, renvoyer les informations d'identification et le rôle de l'utilisateur
  //   const token = generateToken(user); // Générer un token JWT (vous devrez implémenter cette fonction)
  //   res.status(200).json({ status: true, token: token, role: user.role });
  // });





