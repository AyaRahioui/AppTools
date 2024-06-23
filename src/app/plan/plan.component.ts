import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PlanService } from '../services/plan.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css', '../show-res/show-res.component.scss', '../result/result.component.css']
})
export class PlanComponent implements OnInit {
  role: string | null = null;
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
  date: string = '';
  currentPlanID = '';
  isUpdateMode = false;
  UsersArray: any[] = [];
  ResultsArray: any[] = [];
  dateUrl: string = '';
  filterActor: string = ""; 
  show= false;
  filteredOfficePlans: any[] = [];
  filteredTerrainPlans:   any[] = [];
  isPlanLoaded: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private planService: PlanService,
    private http: HttpClient,
    private toast: HotToastService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.filteredOfficePlans = this.officePlans;
    this.filteredTerrainPlans = this.terrainPlans;
    this.getAllUsers();
    this.getAllRes();
    this.route.paramMap.subscribe(params => {
      this.date = params.get('day') || ''; // Retrieve date from route params
      console.log(this.date + ' getDate');
      this.dateUrl = this.date;
      this.loadPlans(this.currentCategory);
    });
  }

  getAllRes() {
    this.http.get('http://127.0.0.1:8000/api/result').subscribe(
      (response: any) => {
        // Assuming response is an array
        this.ResultsArray = response;
        console.log(this.ResultsArray);
      },
      error => {
        this.toast.error('Error fetching results');
        console.error(error);
      }
    );
  }

  toggleView(category: string): void {
    this.isOfficeVisible = category === 'office';
    this.isTerrainVisible = category === 'terrain';
    this.currentCategory = category;
    this.loadPlans(category);
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  // loadPlans(category: string): void {
  //   this.planService.getPlans(category).subscribe(data => {
  //     if (category === 'office') {
  //       this.officePlans = data.filter((plan: any) => plan.date === this.date);
  //       console.log(this.officePlans);
  //     } else if (category === 'terrain') {
  //       this.terrainPlans = data.filter((plan: any) => plan.date === this.date);
  //       console.log(this.terrainPlans);
  //     }
  //   });
  // }
  loadPlans(category: string): void {
    this.planService.getPlans(category).subscribe(data => {
      if (category === 'office') {
        this.officePlans = data.filter((plan: any) => plan.date === this.date);
        this.filteredOfficePlans = this.officePlans; // Initializing filtered plans
        this.isPlanLoaded = true;
      } else if (category === 'terrain') {
        this.terrainPlans = data.filter((plan: any) => plan.date === this.date);
        this.filteredTerrainPlans = this.terrainPlans; // Initializing filtered plans
        this.isPlanLoaded = true;
      }
      this.cd.detectChanges(); // Trigger change detection
    });
  }
  applyFilters() {
    if (this.filterActor) {
      this.filteredOfficePlans = this.officePlans.filter(plan => plan.actor === this.filterActor);
      this.filteredTerrainPlans = this.terrainPlans.filter(plan => plan.actor === this.filterActor);
    } else {
      this.filteredOfficePlans = this.officePlans;
      this.filteredTerrainPlans = this.terrainPlans;
    }
  }
  filterByActor(): void {
    if (this.currentCategory === 'office') {
      this.officePlans = this.officePlans.filter(plan => plan.actor === this.filterActor);
    } else if (this.currentCategory === 'terrain') {
      this.terrainPlans = this.terrainPlans.filter(plan => plan.actor === this.filterActor);
    }
  }
  
  toggleFilter() {
    this.show = !this.show;

  }
  register(): void {
    const plan = this.currentCategory === 'office' ?
      { category: 'office', actor: this.actor, descriptif: this.descriptif, date: this.date } :
      { category: 'terrain', date: this.date, result: this.result, label: this.label, zone_intervention: this.zone_intervention, descriptif: this.descriptif, actor: this.actor };

    this.planService.createPlan(plan).subscribe(() => {
      this.loadPlans(this.currentCategory);
      this.resetForm();
      this.showForm = false;
      this.toast.success('Plan registered successfully');
    }, error => {
      console.error('Error registering plan:', error);
      this.toast.error('Error registering plan');
    });
  }

  resetForm(): void {
    this.actor = '';
    this.descriptif = '';
    this.result = '';
    this.label = '';
    this.zone_intervention = '';
  }

  setUpdate(plan: any): void {
    this.currentPlanID = plan.id;
    this.actor = plan.actor;
    this.descriptif = plan.descriptif;

    if (this.currentCategory === 'terrain') {
      this.result = plan.result;
      this.label = plan.label;
      this.zone_intervention = plan.zone_intervention;
    }

    this.showForm = true;
    this.isUpdateMode = true;
  }

  setDelete(data: any) {
    const url = `http://127.0.0.1:8000/api/plan/${data.id}?category=${this.currentCategory}`;
    this.http.delete(url, { responseType: 'text' }).subscribe(resultData => {
      console.log(resultData);
      this.toast.success('Résultat supprimé avec succès!');
      this.loadPlans(this.currentCategory);
    }, error => {
      console.error('Error deleting plan:', error);
      this.toast.error('Error deleting plan');
    });
  }

  getAllUsers() {
    this.http.get('http://127.0.0.1:8000/api/user').subscribe(
      (users: any) => {
        this.UsersArray = users.users;
        console.log(this.UsersArray);
      },
      error => {
        this.toast.error('Error fetching users');
        console.error(error);
      }
    );
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
      this.http.put('http://127.0.0.1:8000/api/plan/' + this.currentPlanID, bodyData).subscribe(
        resultData => {
          console.log(resultData);
          this.toast.success('Résultat modifié avec succès!');
          this.loadPlans(this.currentCategory);
          this.toggleForm();
        },
        error => {
          console.error('Error updating record:', error);
          this.toast.error('Erreur lors de la modification du résultat.');
        }
      );
    } else {
      console.error('Invalid category:', this.currentCategory);
      this.toast.error('Catégorie invalide.');
    }
  }

  save() {
    if (this.isUpdateMode) {
      this.UpdateRecords();
    } else {
      this.register();
    }
  }
}
