import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent implements OnInit {
ngOnInit(): void {
  
}

  submitted: boolean = false;
  showForm: boolean = false;
  grps: any[] = []; // Assuming grps is the array where you store your group data
  currentGroupId = "";
  isUpdateMode = false;

   ResultArray : any[] = [];
  isResultLoaded = false;
 
  
  name: string ="";

 
  currentResultID = "";
constructor(private http: HttpClient , private toast: HotToastService)
  {
    this.getAllResult();
 
  }
  getAllResult()
  {
    
    this.http.get("http://127.0.0.1:8000/api/plan")
  
    .subscribe((resultData: any)=>
    {
        this.isResultLoaded = true;
        console.log(resultData);
        this.ResultArray = resultData;
    });
  }
 
  register()
  {
  
    let bodyData = {
      "name" : this.name,
     
    };
 
    this.http.post("http://127.0.0.1:8000/api/plan",bodyData,{responseType: 'text'}).subscribe((resultData: any)=>
    {
        console.log(resultData);
        this.toast.success('Résultat créé avec succés!');
        this.getAllResult();
        this.name = '';

    });
    this.toggleForm();

  }
  setUpdate(data: any)
  {
    this.showForm = !this.showForm;
   this.name = data.name;
   this.currentResultID = data.id;
   this.isUpdateMode = true;

  }
 
  UpdateRecords()
  {
    let bodyData = {
      "id" : this.currentResultID,
      "name" : this.name,
  
    };
    
    this.http.put("http://127.0.0.1:8000/api/plan"+ "/"+ this.currentResultID,bodyData).subscribe((resultData: any)=>
    {
        console.log(resultData);
        this.toast.success('Résultat modifié avec succés!');
        
        this.getAllResult();
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
    
    
    this.http.delete("http://127.0.0.1:8000/api/plan"+ "/"+ data.id,{responseType: 'text'}).subscribe((resultData: any)=>
    {
        console.log(resultData);
        this.toast.success('Résultat supprimé avec succés!');
        this.getAllResult();
        this.name = '';
  
    });
 
  }

  reset() {
    this.name = "";
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


