import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
  
})
export class UserAuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      let jwt = localStorage.getItem('token');


      if (jwt) {
          // Diviser le jeton JWT pour obtenir les données de charge utile
          let jwtData = jwt.split('.')[1];
      
          // Décoder les données JSON de la charge utile du jeton JWT
          let decodedJwtJsonData = window.atob(jwtData);
      
          // Parser les données JSON décodées du jeton JWT
          let decodedJwtData = JSON.parse(decodedJwtJsonData);
      
          // Vérifier si l'utilisateur est un administrateur
          let role = decodedJwtData.role;
          if (role !== null && role === 'user') {
            return true;
          }
        }
          this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
          return false;
        }
      }
      