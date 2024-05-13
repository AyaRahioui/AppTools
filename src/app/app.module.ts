import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { UserComponent } from './user/user.component';
import { AdminComponent } from './admin/admin.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NavBarAdminComponent } from './nav-bar-admin/nav-bar-admin.component';
import { PlanComponent } from './plan/plan.component';
//import { InterceptorModule } from './interceptor.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OverlayModule } from '@angular/cdk/overlay';
import { ResultComponent } from './result/result.component';


import { MatDialogModule,MatDialogConfig  } from '@angular/material/dialog';


import { ShowResComponent } from './show-res/show-res.component';
import { ActionComponent } from './action/action.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    UserComponent,
    AdminComponent,
    NavBarComponent,
    PlanComponent,
    ResultComponent,
    ActionComponent,
    ShowResComponent,
    NavBarAdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonModule,
   // InterceptorModule,
    NgbModule,
    MatDialogModule,
    OverlayModule,
    FormsModule 

  ],
  providers: [MatDialogConfig],
  bootstrap: [AppComponent]
})
export class AppModule { }
