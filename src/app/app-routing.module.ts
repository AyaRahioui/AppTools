import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { UserComponent } from './user/user.component';
import { PlanComponent } from './plan/plan.component';
import { ResultComponent } from './result/result.component';
import { UserAuthGuard } from './user-auth.guard';
import { DirectorAuthGuard } from './director-auth.guard';
import { AdminComponent } from './admin/admin.component';
import { AfterLoginService } from './services/after-login.service';
import { BeforeLoginService } from './services/before-login.service';
import { ShowResComponent } from './show-res/show-res.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { EvaluateComponent } from './evaluate/evaluate.component';
import { RemindersComponent } from './reminders/reminders.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'login', component:LoginComponent },
  { path: 'sign-up', component:SignUpComponent},
  { path: 'img', component:ImageUploadComponent },
  { path: 'schedule', component:ScheduleComponent },
  { path: 'evaluate', component:EvaluateComponent },
  { path: 'reminder', component:RemindersComponent },
 { path: 'plan/:day', component:PlanComponent/*,canActivate:[AfterLoginService,DirectorAuthGuard]*/},
 { path: 'result', component:ResultComponent  /*,canActivate:[AfterLoginService,DirectorAuthGuard]*/},
  { path: 'user', component: UserComponent /*, canActivate: [AfterLoginService, UserAuthGuard] */},
  { path: 'admin', component: AdminComponent/*, canActivate: [DirectorAuthGuard] */},
  { path: 'showRes/:id', component: ShowResComponent,/*canActivate: [AfterLoginService, DirectorAuthGuard]*/ },
  { path: '**', redirectTo: '/login' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }