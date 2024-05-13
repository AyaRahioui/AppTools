import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit{
  public loggedIn:boolean = false;
  constructor(private Auth:AuthService,private jwt:TokenService,private router:Router) { }

  ngOnInit(): void {
    this.Auth.authStatus.subscribe(
      value=>{
        this.loggedIn = value
      }
  );
}


  logout(event:MouseEvent){
    event.preventDefault();
    this.jwt.remove();
    this.Auth.changeAuthStatus(false);
    this.router.navigateByUrl('/login');
  }

}
