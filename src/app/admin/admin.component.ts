import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ProjectService } from '../services/projet.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, AfterViewInit {
  currentCategory: string = '';
  projectsPa: any[] = [];
  projectsPb: any[] = [];
  projectsPc: any[] = [];
  projectsPd: any[] = [];
  projectsPe: any[] = [];
  projectsPf: any[] = [];
  projectsPg: any[] = [];
  projectsPh: any[] = [];

  nb_init_pa: number = 0;
  nb_init_pb: number = 0;
  nb_init_pc: number = 0;
  nb_init_pd: number = 0;
  nb_init_pe: number = 0;
  nb_init_pf: number = 0;
  nb_init_pg: number = 0;
  nb_init_ph: number = 0;
  
  @ViewChild('paCard') paCard: ElementRef | null = null;
  @ViewChild('pbCard') pbCard: ElementRef | null = null;
  @ViewChild('pcCard') pcCard: ElementRef | null = null;
  @ViewChild('pdCard') pdCard: ElementRef | null = null;
  @ViewChild('peCard') peCard: ElementRef | null = null;
  @ViewChild('pfCard') pfCard: ElementRef | null = null;
  @ViewChild('pgCard') pgCard: ElementRef | null = null;
  @ViewChild('phCard') phCard: ElementRef | null = null;
  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    // You can initialize things here if necessary
  }

  ngAfterViewInit(): void {
    if (this.paCard) {
      this.fetchProjectsByCategory('pa');
    }
    if (this.pbCard) {
      this.fetchProjectsByCategory('pb');
    }
    if (this.pcCard) {
      this.fetchProjectsByCategory('pc');
    }
    if (this.pdCard) {
      this.fetchProjectsByCategory('pd');
    }
    if (this.peCard) {
      this.fetchProjectsByCategory('pe');
    }
    if (this.pfCard) {
      this.fetchProjectsByCategory('pf');
    }
    if (this.pgCard) {
      this.fetchProjectsByCategory('pg');
    }
    if (this.phCard) {
      this.fetchProjectsByCategory('ph');
    }
  }

  fetchProjectsByCategory(category: string): void {
    const name = this.mapCategoryToName(category);
    this.currentCategory = name;
    console.log(`Fetching projects for category: ${category}, name: ${name}`);
    this.projectService.getProjectsByName(name).subscribe(
      data => {
        console.log('Projects fetched:', data);
        const projects = data.map(project => {
          project.imgs = Array.isArray(project.imgs) ? project.imgs : [];
          return project;
        });

        if (category === 'pa') {
          this.projectsPa = projects;
          this.nb_init_pa = projects.length;
        } else if (category === 'pb') {
          this.projectsPb = projects;
          this.nb_init_pb = projects.length;
        } else if (category === 'pc') {
          this.projectsPc = projects;
          this.nb_init_pc = projects.length;
        } else if (category === 'pd') {
          this.projectsPd = projects;
          this.nb_init_pd = projects.length;
        } else if (category === 'pe') {
          this.projectsPe = projects;
          this.nb_init_pe = projects.length;
        } else if (category === 'pf') {
          this.projectsPf = projects;
          this.nb_init_pf = projects.length;
        } else if (category === 'pg') {
          this.projectsPg = projects;
          this.nb_init_pg = projects.length;
        }else if (category === 'ph') {
          this.projectsPh = projects;
          this.nb_init_ph = projects.length;
        }
      },
      error => {
        console.error('Error fetching projects:', error);
      }
    );
  }

  mapCategoryToName(category: string): string {
    const map: { [key: string]: string } = {
      pa: 'Wash',
      pb: 'Dev_rural',
      pc: 'Dev_communautaire',
      pd: 'Charité',
      pe: 'Aménagement',
      pf: 'Education',
      pg: 'Santé',
      ph: 'Autre'
    };
    return map[category] || '';
  }
}
