import { Component, OnInit } from '@angular/core';
import { PlanService } from '../services/plan.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css','../show-res/show-res.component.scss','../result/result.component.css']
})
export class PlanComponent implements OnInit {
  isOfficeVisible: boolean = true;
  isTerrainVisible: boolean = false;
  showForm: boolean = false;
  officePlans: any[] = [];
  terrainPlans: any[] = [];
  currentCategory: string = 'office';
  actor: string = '';
  descriptif: string = '';
  result: string = '';
  label: string = '';
  zone_intervention: string = '';
  submitted: boolean = false;
  date:string='';
  currentPlanID = "";
  isUpdateMode = false;


  constructor(private route: ActivatedRoute,private planService: PlanService,private http: HttpClient , private toast: HotToastService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.date = params.get('day') || ''; // Retrieve date from route params
      console.log(this.date + " getDate");
    });
    if(this.currentCategory=='office')
    this.loadPlans('office');
    if(this.currentCategory=='terrain')
      this.loadPlans('terrain');
  }

  toggleView(category: string): void {
    if (category === 'office') {
      this.isOfficeVisible = true;
      this.isTerrainVisible = false;
    } else if (category === 'terrain') {
      this.isOfficeVisible = false;
      this.isTerrainVisible = true;
    }
    this.currentCategory = category;
    this.loadPlans(category);
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    this.isUpdateMode = false;
  }

  loadPlans(category: string): void {
    this.planService.getPlans(category).subscribe(data => {
      if (category === 'office') {
        this.officePlans = data;
      } else if (category === 'terrain') {
        this.terrainPlans = data;
      }
    });
  }

  register(): void {
    const plan = this.currentCategory === 'office' ? 
      { category:"office",actor: this.actor, descriptif: this.descriptif,date:this.date} : 
      { category:"terrain",date:this.date,result: this.result, label: this.label, zone_intervention: this.zone_intervention, descriptif: this.descriptif };
    
    this.planService.createPlan(plan).subscribe(() => {
      this.loadPlans(this.currentCategory);
      this.reset();
      this.showForm = false;
    });
  }

  reset(): void {
    this.actor = '';
    this.descriptif = '';
    this.result = '';
    this.label = '';
    this.zone_intervention = '';
  }
  setUpdate(plan: any): void {
    if (this.currentCategory === 'office') {
      this.currentPlanID=plan.id;
      this.actor = plan.actor;
      this.descriptif = plan.descriptif;
    } else if (this.currentCategory === 'terrain') {
      this.currentPlanID=plan.id;
      this.result = plan.result;
      this.label = plan.label;
      this.zone_intervention = plan.zone_intervention;
      this.descriptif = plan.descriptif;
    }
    this.showForm = true;
    this.isUpdateMode = true;
  }


  setDelete(data: any) {
    const url = `http://127.0.0.1:8000/api/plan/${data.id}?category=${this.currentCategory}`;
    this.http.delete(url, { responseType: 'text' }).subscribe((resultData: any) => {
        console.log(resultData);
        this.toast.success('Résultat supprimé avec succès!');
        this.loadPlans(this.currentCategory);
        console.log(url)    });
}







  UpdateRecords(): void {
    let bodyData: any;
    
    if (this.currentCategory === 'office') {
      bodyData = {
        id: this.currentPlanID,
        category: this.currentCategory,
        actor: this.actor,
        descriptif: this.descriptif,
        date: this.date
      };
    } else if (this.currentCategory === 'terrain') {
      bodyData = {
        id: this.currentPlanID,
        category: this.currentCategory,
        actor: this.actor,
        descriptif: this.descriptif,
        date: this.date,
        result: this.result,
        label: this.label,
        zone_intervention: this.zone_intervention
      };
    }
    
    if (bodyData) {
      this.http.put("http://127.0.0.1:8000/api/plan/" + this.currentPlanID, bodyData).subscribe(
        (resultData: any) => {
          console.log(resultData);
          this.toast.success('Résultat modifié avec succès!');
          this.loadPlans(this.currentCategory);
          this.toggleForm();
        },
        (error) => {
          console.error('Error updating record:', error);
          this.toast.error('Erreur lors de la modification du résultat.');
        }
      );
    } else {
      console.error('Invalid category:', this.currentCategory);
      this.toast.error('Catégorie invalide.');
    }
  }
  
 
  save()
  {
    if (this.isUpdateMode) {
      this.UpdateRecords();
    } else {
      this.register();
    }
 
  }
}
