import { Component } from '@angular/core';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['../plan/plan.component.css','../show-res/show-res.component.scss','../result/result.component.css']
})
export class ProjectsComponent {
  isOfficeVisible: boolean = true;
  isTerrainVisible: boolean = false;
  isUpdateMode = false;
  showForm: boolean = false;
  toggleView(category: string): void {
    if (category === 'office') {
      this.isOfficeVisible = true;
      this.isTerrainVisible = false;
    } else if (category === 'terrain') {
      this.isOfficeVisible = false;
      this.isTerrainVisible = true;
    }
  }
  toggleForm(): void {
    this.showForm = !this.showForm;
    this.isUpdateMode = false;
  }
}
