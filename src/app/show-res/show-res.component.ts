import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-show-res',
  templateUrl: './show-res.component.html',
  // styleUrls: ['./show-res.component.css']
  styleUrls: ['../plan/plan.component.css','./show-res.component.css']
})
export class ShowResComponent implements OnInit {
  constructor(private http: HttpClient , private toast: HotToastService,private route: ActivatedRoute)
  {
    this.getAllActivity();
 
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        // Appel à une fonction pour afficher la page en fonction de l'ID
        this.showPageById(id);
      }
    });
  }

  showPageById(id: string) {
    // Logique pour afficher la page en fonction de l'ID
    console.log('Naviguer vers la page avec l\'ID :', id);
    // Vous pouvez utiliser cet ID pour effectuer des opérations spécifiques dans votre composant
  }

    submitted: boolean = false;
    showForm: boolean = false;

    isUpdateMode = false;
  
    activityArray : any[] = [];
    isActivityLoaded = false;
   
    
    name: string ="";
    description: string ="";
    dueDate: string ="";
    label: string ="";
    result_id: string ="";

   
    currentActivityID = "";
    getId(){
      let resultId;
      return  resultId = this.route.snapshot.paramMap.get('id');
    }
    getAllActivity() {
      const resultId=this.getId();
      console.log(resultId + "resultId");
      this.http.get<any[]>(`http://127.0.0.1:8000/api/activity?result_id=${resultId}`)
        .subscribe((activityData: any[]) => {
          this.isActivityLoaded = true;
          console.log(activityData);
          this.activityArray = activityData;
        });
    }
   
    register()
    {
      const resultId=this.getId();
      let bodyData = {
        "name" : this.name,
        "description" : this.description,
        "dueDate" : this.dueDate,
        "label" : this.label,
        "result_id" : resultId,
       
      };
   
      this.http.post("http://127.0.0.1:8000/api/activity",bodyData,{responseType: 'text'}).subscribe((activityData: any)=>
      {
          console.log(activityData);
          this.toast.success('Résultat créé avec succés!');
          this.getAllActivity();
          this.reset();
  
      });
      this.toggleForm();
  
    }
    setUpdate(data: any)
    {
      const resultId=this.getId();
      if(resultId){
        this.showForm = !this.showForm;
        this.name = data.name;
        this.description = data.description;
        this.dueDate = data.dueDate;
        this.label = data.label;
        this.result_id = resultId;
        this.currentActivityID = data.id;
        this.isUpdateMode = true;
      }
    
  
    }
   
    UpdateRecords()
    {
      const resultId=this.getId();
      let bodyData = {
        "id" : this.currentActivityID,
        "name" : this.name,
        "description" : this.description,
        "dueDate" : this.dueDate,
        "label" : this.label,
        "result_id" : resultId,
      };
      
      this.http.put("http://127.0.0.1:8000/api/activity"+ "/"+ this.currentActivityID,bodyData).subscribe((activityData: any)=>
      {
          console.log(activityData);
          this.toast.success('Résultat modifié avec succés!');
          
          this.getAllActivity();
          this.toggleForm();
        
      });
    }
   
    save()
    {
      if (this.isUpdateMode) {
        this.UpdateRecords();
      } else {
        this.register();
      }
   
    }
   
    setDelete(data: any)
    {
      
      
      this.http.delete("http://127.0.0.1:8000/api/result"+ "/"+ data.id,{responseType: 'text'}).subscribe((activityData: any)=>
      {
          console.log(activityData);
          this.toast.success('Résultat supprimé avec succés!');
          this.getAllActivity();
        this.reset();
    
      });
   
    }
  
    reset() {
      this.name = "";
      this.description = "";
      this.label = "";
      this.dueDate = "";
    }
  
    toggleForm(): void {
      this.showForm = !this.showForm;
      this.reset();
      this.submitted = false;
      this.isUpdateMode = false;
    }
  
    submitForm(): void {
      // Logique pour soumettre le formulaire
      console.log('Formulaire soumis!');
      // Vous pouvez ajouter ici une logique supplémentaire pour traiter les données du formulaire
      this.cancelForm();
    }
  
    cancelForm(): void {
      this.showForm = false;
      this.reset();
    }
  
  
  
  
  
}
