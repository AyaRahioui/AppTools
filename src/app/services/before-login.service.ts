import { Injectable } from '@angular/core';
import{CanActivate,ActivatedRouteSnapshot,RouterStateSnapshot, UrlTree} from'@angular/router';
import { Observable } from 'rxjs';
import{TokenService}from './token.service'
@Injectable({
  providedIn: 'root'
})
export class BeforeLoginService implements CanActivate{
canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
  return !this.jwt.loggedIn();
}
  constructor(private jwt:TokenService) { }
}
