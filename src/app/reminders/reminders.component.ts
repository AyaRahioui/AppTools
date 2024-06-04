// reminders.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { ReminderService } from '../services/reminder.service';
import { ResultService } from '../services/result.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reminders',
  templateUrl: './reminders.component.html',
  styleUrls: ['./reminders.component.css']
})
export class RemindersComponent implements OnInit {
  @Input() isAdminView: boolean = false;
  reminders: any[] = [];
  resultNames: { [key: number]: string } = {};
  showAllReminders: boolean = false;

  constructor(private reminderService: ReminderService, private resultService: ResultService, private router: Router) { }

  ngOnInit(): void {
    this.loadReminders();
  }

  loadReminders(): void {
    this.reminderService.getDueReminders().subscribe(data => {
      this.reminders = data;
      this.reminders.forEach(reminder => {
        this.loadResultName(reminder.result_id);
      });
    });
  }

  loadResultName(resultId: number): void {
    this.resultService.getResultName(resultId).subscribe(name => {
      this.resultNames[resultId] = name;
    });
  }

  getResultName(resultId: number): string {
    return this.resultNames[resultId] || 'Loading...';
  }

  viewDetails(): void {
    this.router.navigate(['/reminder']); // Adjust the route as per your application
  }
}
