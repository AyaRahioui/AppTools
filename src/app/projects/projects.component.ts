import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { HotToastService } from '@ngneat/hot-toast';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { storage } from "../firebase.config";
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../services/projet.service';
import { FormGroup } from '@angular/forms';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['../plan/plan.component.css','../show-res/show-res.component.scss','../result/result.component.css']
})
export class ProjectsComponent implements OnInit {
  loading: boolean = false;

  projects: any[] = [];
  projectName: string = '';
  visibleProjects: any[] = [];
  ispaVisible: boolean = true;
  ispbVisible: boolean = false;
  ispcVisible: boolean = false;
  ispdVisible: boolean = false;
  ispeVisible: boolean = false;
  ispfVisible: boolean = false;
  isphVisible: boolean = false;
  showForm: boolean = false;
  currentPage = 0;
  pageSize = 5;
  submitted: boolean = false;
  isUpdateMode = false;
  ProjectsArray: any[] = [];
  UsersArray: any[] = [];
  ActivitiesArray: any[] = [];
  isProjectsLoaded = false;
  name: string = "";
  date: string = "";
  zi: string = "";
  activity: string = "";
  nbBeneficiaryM: string = "";
  nbBeneficiaryF: string = "";
  nbBeneficiaryTotal: string = "";
  observation: string = "";
  description: string = "";
  nb_init: string = this.projects.length.toString();
  currentProjectID = "";
  fileUploads: File[] = [];
  pdfUrl: string = "";
  imgUrls: string[] = [];
  photoModalVisible: boolean = false;
  currentPhotos: string[] = [];
  pagedProjectsArray: any[] = [];
  FiltredArray: any[] = [];
  currentCategory: string = '';
  filterStartDate: Date | null = null;
  filterEndDate: Date | null = null;
  fetchProjectsByCategory(category: string): void {
    const name = this.mapCategoryToName(category);
    this.currentCategory = name;
    this.projectservice.getProjectsByName(name).subscribe(
      data => {
        this.projects = data.map(project => {
          project.imgs = Array.isArray(project.imgs) ? project.imgs : [];
          return project;
        });
        this.applyFilters();
      }
    );
  }

  show = false;
  toggle() {
    this.show = !this.show;
  }
  // applyFilters(): void {
  //   let filteredProjects = this.projects;

  //   if (this.filterStartDate || this.filterEndDate) {
  //     filteredProjects = filteredProjects.filter(project => {
  //       const projectDate = new Date(project.date);
  //       if (this.filterStartDate && this.filterEndDate) {
  //         return projectDate >= this.filterStartDate && projectDate <= this.filterEndDate;
  //       } else if (this.filterStartDate) {
  //         return projectDate >= this.filterStartDate;
  //       } else if (this.filterEndDate) {
  //         return projectDate <= this.filterEndDate;
  //       }
  //       return true;
  //     });
  //   }

  //   this.updatePagedDataF(filteredProjects);
  // }
  applyFilters(): void {
    let filteredProjects = this.projects;

    if (this.filterStartDate || this.filterEndDate) {
        filteredProjects = filteredProjects.filter(project => {
            const projectDate = new Date(project.date);
            if (this.filterStartDate && this.filterEndDate) {
                return projectDate >= this.filterStartDate && projectDate <= this.filterEndDate;
            } else if (this.filterStartDate) {
                return projectDate >= this.filterStartDate;
            } else if (this.filterEndDate) {
                return projectDate <= this.filterEndDate;
            }
            return true;
        });
    }

    this.updatePagedDataF(filteredProjects);
}

updatePagedDataF(filteredProjects: any[]): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedProjectsArray = filteredProjects.slice(startIndex, endIndex);
}


resetDateFilter(): void {
    this.filterStartDate = null;
    this.filterEndDate = null;
    this.applyFilters();
}


 

  applyDateFilter(): void {
    this.applyFilters();
  }














  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedDataF(this.projects);
}


  updatePagedData() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedProjectsArray = this.FiltredArray.slice(startIndex, endIndex);
  }
  fetchProjects(category: string): void {
    const name = this.mapCategoryToName(category);
    this.http.get<any[]>(`http://127.0.0.1:8000/api/projects/${name}`).subscribe(data => {
      this.projects = data;
      this.updateVisibleProjects(name);
      this.nb_init = this.projects.length.toString();
      this.FiltredArray = [...this.ProjectsArray]; // Initialize filtered array
      this.updatePagedData(); // Mise à jour des données paginées
    }, error => {
      console.error('Error fetching projects:', error);
      this.toast.error('Error fetching projects. Please try again later.');
    });
  }


  
  toggleView(category: string): void {
    this.ispaVisible = false;
    this.ispbVisible = false;
    this.ispcVisible = false;
    this.ispdVisible = false;
    this.ispeVisible = false;
    this.ispfVisible = false;
    this.isphVisible = false;
    this.ispaVisible = category === 'pa';
    this.ispbVisible = category === 'pb';
    this.ispcVisible = category === 'pc';
    this.ispdVisible = category === 'pd';
    this.ispeVisible = category === 'pe';
    this.ispfVisible = category === 'pf';
    this.isphVisible = category === 'ph';
    this.fetchProjects(category);
  }

  constructor(private router: Router,private http: HttpClient, private toast: HotToastService,private route: ActivatedRoute,private projectservice:ProjectService) {
    this.fetchProjectsByCategory(this.currentCategory);
    this.getAllUsers();
    this.getAllActivities();
  }
  ngOnInit(): void {
    this.refresh();
    // this.fetchProjects(this.currentCategory);
  }
  
  refresh():void{
    this.route.params.subscribe(params => {
      const category = params['category'];
      this.currentCategory = this.mapCategoryToName(category);
      this.fetchProjectsByCategory(category);
    }); 
  }

  // fetchProjectsByCategory(category: string): void {
  //   const name = this.mapCategoryToName(category);
  //   this.currentCategory = name; 
  //   this.projectservice.getProjectsByName(name).subscribe(
  //     data => {
  //       this.projects = data.map(project => {
  //         project.imgs = Array.isArray(project.imgs) ? project.imgs : [];
  //         return project;
  //       });
  //       this.ProjectsArray = this.projects;
  //       this.FiltredArray = [...this.ProjectsArray];
  //       this.updatePagedData();
  //     }
  //   );
  // }
  
  mapCategoryToName(category: string): string {
    const map: { [key: string]: string } = {
      pa: 'Wash',
      pb: 'Dev_rural',
      pc: 'Dev_communautaire',
      pd: 'Charité',
      pe: 'Aménagement',
      pf: 'Education',
      pg: 'Santé',
      ph: 'Autre',
    };
    return map[category] || '';
  }
  


  updateVisibleProjects(name: string): void {
    this.visibleProjects = this.projects.filter(project => project.name === name);
  }
  // getAllProjects() {
  //     this.http.get("http://127.0.0.1:8000/api/project").subscribe((response: any) => {
  //       this.ProjectsArray = response;
  //     });
  // }
  // getAllProjects() {
  //   this.http.get("http://127.0.0.1:8000/api/project").subscribe((resultData: any) => {
  //     // this.isProjectsLoaded = true;
  //     this.ProjectsArray = resultData.map((project: any) => {
  //       if (project.imgs) {
  //         project.imgs = JSON.parse(project.imgs); // Deserialize imgs
  //       }
  //       return project;
  //     });
  //   });
  // }
  register() {
    this.loading = true;
    let bodyData = {
        "name": this.currentCategory,
        "date": this.date,
        "zi": this.zi,
        "activity": this.activity,
        "nbBeneficiaryM": this.nbBeneficiaryM,
        "nbBeneficiaryF": this.nbBeneficiaryF,
        "nbBeneficiaryTotal": this.nbBeneficiaryTotal,
        "observation": this.observation,
        "description": this.description,
        "pdf": this.pdfUrl,
        "imgs": JSON.stringify(this.imgUrls),
        "nb_init":  this.projects.length.toString()
    };



    this.http.post("http://127.0.0.1:8000/api/project", bodyData, { responseType: 'json' }).subscribe((resultData: any) => {
        this.toast.success('Projet créé avec succès!');
        this.refresh();
        this.loading = false;
        this.reset();
    });
    this.toggleForm();
}
refreshPage() {
  // Refresh the current route
  this.router.navigate([this.route.snapshot.url[0].path]); // Navigate to the current route
}
updateRecords() {
  this.loading = true;
    let bodyData = {
        "id": this.currentProjectID,
        "name": this.currentCategory,
        "date": this.date,
        "zi": this.zi,
        "activity": this.activity,
        "nbBeneficiaryM": this.nbBeneficiaryM,
        "nbBeneficiaryF": this.nbBeneficiaryF,
        "nbBeneficiaryTotal": this.nbBeneficiaryTotal,
        "observation": this.observation,
        "description": this.description,
        "pdf": this.pdfUrl,
        "imgs": JSON.stringify(this.imgUrls),
        "nb_init": this.projects.length.toString()
    };

    this.http.put("http://127.0.0.1:8000/api/project" + "/" + this.currentProjectID, bodyData, { responseType: 'json' }).subscribe((resultData: any) => {
        this.toast.success('Projet modifié avec succès!');
        this.refresh();
        this.loading = false;
    });
    this.toggleForm();
}


  save() {
    this.loading = true;
    if (this.fileUploads.length > 0) {
      this.uploadFiles().then(() => {
        if (this.isUpdateMode) {
          this.updateRecords();
        } else {
          this.register();
        }
        this.loading = false;
      });
    } else {
      if (this.isUpdateMode) {
        this.updateRecords();
      } else {
        this.register();
      }
      this.loading = false;
    }
  }

  uploadFiles(): Promise<void> {
    return new Promise((resolve, reject) => {
      const uploadPromises = this.fileUploads.map(file => {
        const fileType = file.type;
        const fileExtension = fileType.split('/')[1];
        const fileName = `${file.name}-${uuidv4()}.${fileExtension}`;
        const fileRef = ref(storage, `uploadsProject/${fileName}`);

        return uploadBytes(fileRef, file).then(snapshot => {
          return getDownloadURL(snapshot.ref).then(url => {
            if (fileType === 'application/pdf') {
              this.pdfUrl = url;
            } else {
              this.imgUrls.push(url);
            }
          });
        });
      });

      Promise.all(uploadPromises).then(() => resolve()).catch(error => reject(error));
    });
  }
  calculateTotal(): void {
    if (this.nbBeneficiaryM && this.nbBeneficiaryF) {
      const nbBeneficiaryM = parseFloat(this.nbBeneficiaryM);
      const nbBeneficiaryF = parseFloat(this.nbBeneficiaryF);
      this.nbBeneficiaryTotal = (nbBeneficiaryM + nbBeneficiaryF).toFixed(0); // Assurez-vous que le total est formaté selon vos besoins
    } else {
      this.nbBeneficiaryTotal = ''; // Réinitialisez le total si la quantité ou le prix par litre est vide
    }
  }

  // calculateNbInit():void{
  //   this.nbBeneficiaryTotal = this.projectservice.countProjectsByName(this.currentCategory);
  // }
  // calculateNbInit(): void {
  //   this.projectservice.countProjectsByName(this.currentCategory).subscribe(
  //     (count: number) => {
  //       this.nbBeneficiaryTotal = count;
  //     },
  //     (error: any) => {
  //       console.error('Error fetching project count', error);
  //     }
  //   );
  // }
  setUpdate(data: any) {
    this.showForm = true;
    this.name = data.name;
    this.date = data.date;
    this.zi = data.zi;
    this.activity = data.activity;
    this.nbBeneficiaryM = data.nbBeneficiaryM;
    this.nbBeneficiaryF = data.nbBeneficiaryF;
    this.nbBeneficiaryTotal = data.nbBeneficiaryTotal;
    this.observation = data.observation;
    this.description = data.description;
    this.currentProjectID = data.id;
    this.pdfUrl = data.pdf;
    this.imgUrls = data.imgs || [];
    this.isUpdateMode = true;
  }

  setDelete(data: any) {
    this.http.delete("http://127.0.0.1:8000/api/project" + "/" + data.id, { responseType: 'text' }).subscribe(() => {
      this.toast.success('Projet supprimé avec succès!');
      this.refresh();
      this.reset();
    });
  }
  reset() {
    this.name = "";
    this.date = "";
    this.zi = "";
    this.activity = "";
    this.nbBeneficiaryM = "";
    this.nbBeneficiaryF = "";
    this.nbBeneficiaryTotal = "";
    this.observation = "";
    this.description = "";
    this.pdfUrl = "";
    this.imgUrls = [];
    this.fileUploads = [];
    this.nb_init ="";
  }
  

  getAllUsers() {
    this.http.get("http://127.0.0.1:8000/api/user").subscribe(
      (users: any) => {
        this.UsersArray = users.users;
        console.log(this.UsersArray);
      },
      (error) => {
        this.toast.error('Error fetching users');
        console.error(error);
      }
    );
  }

  getAllActivities() {
    this.http.get("http://127.0.0.1:8000/api/activity").subscribe(
      (activities: any) => {
        this.ActivitiesArray = activities.activities;
        console.log(this.ActivitiesArray);
      },
      (error) => {
        this.toast.error('Error fetching activities');
        console.error(error);
      }
    );
  }



  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.reset();
    }
    this.submitted = false;
    this.isUpdateMode = false;
  }

 

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = Array.from(target.files || []);
    
    const newFileUploads = files.filter(file => {
      const fileType = file.type;
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      return allowedTypes.includes(fileType);
    });

    const pdfFiles = newFileUploads.filter(file => file.type === 'application/pdf');
    const imageFiles = newFileUploads.filter(file => file.type !== 'application/pdf');

    if (pdfFiles.length > 1) {
      alert('Only one PDF file is allowed.');
      this.fileUploads = [...imageFiles, pdfFiles[0]];
    } else if (imageFiles.length > 7) {
      alert('You can upload a maximum of 7 images.');
      this.fileUploads = [...pdfFiles, ...imageFiles.slice(0, 7)];
    } else {
      this.fileUploads = newFileUploads;
    }
  }



  openPhotoModal(imgs: string[]): void {
    console.log('Images:', imgs);
    this.currentPhotos = imgs;
    this.photoModalVisible = true;
  }

  closePhotoModal(): void {
    this.photoModalVisible = false;
    this.currentPhotos = [];
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    this.date = event.value ? event.value.toISOString().substring(0, 10) : '';
  }


  downloadPhoto(photoUrl: string): void {
    const link = document.createElement('a');
    link.href = photoUrl;
    link.download = photoUrl.split('/').pop() || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  exportToPdf(): void {
    const doc = new jsPDF('landscape');
    const headers = [['Id', 'Date', 'ZI', 'Activité', 'Nb-H', 'Nb-F', 'Nb-T', 'Observation', 'Description']];
    const data: any[][] = [];
    const title = this.pagedProjectsArray[0]?.name || 'Projet';

    // Add title
    doc.setFontSize(18);
    doc.text(title, doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
    this.pagedProjectsArray.forEach((item) => {
        data.push([
            item.id,
            item.date,
            item.zi,
            item.activity,
            item.nbBeneficiaryM,
            item.nbBeneficiaryF,
            item.nbBeneficiaryTotal,
            item.observation,
            item.description
        ]);
    });
  
    (doc as any).autoTable({
        head: headers,
        body: data,
        startY: 20,
        theme: 'grid',
        headStyles: { fillColor: [22, 160, 133] },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        styles: { fontSize: 10, cellPadding: 3 },
        columnStyles: {
            0: { cellWidth: 10 }, // Id
            1: { cellWidth: 30 }, // Date
            2: { cellWidth: 30 }, // ZI
            3: { cellWidth: 40 }, // Activité
            4: { cellWidth: 15 }, // Nb-Homme
            5: { cellWidth: 15 }, // Nb-Femme
            6: { cellWidth: 20 }, // Nb-Total
            7: { cellWidth: 60 }, // Observation
            8: { cellWidth: 60 }  // Description
        },
        didDrawCell: (data: { column: { index: number; }; cell: { width: any; raw: any; }; }) => {
            if (data.column.index === 8) { // If it's the Description column
                let cellWidth = data.cell.width;
                let text = data.cell.raw;
                let textWidth = doc.getTextWidth(text);
                if (textWidth > cellWidth) {
                    doc.setFontSize(8); // Adjust font size if text is too wide
                }
            }
        },
        margin: { top: 20, right: 10, bottom: 20, left: 10 }
    });
  
    doc.save('projects.pdf');
  }
}  