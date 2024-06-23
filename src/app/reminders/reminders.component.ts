import { Component, Input, OnInit } from '@angular/core';
import { ReminderService } from '../services/reminder.service';
import { ResultService } from '../services/result.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

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

  constructor(
    private reminderService: ReminderService,
    private resultService: ResultService,
    private router: Router,
    private authService: AuthService
  ) {}

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
    const userRole = this.authService.getUserRole();
    if (userRole === 'admin') {
      this.router.navigate(['/action']); // Redirect to admin-specific route
    } else {
      this.router.navigate(['/reminder']); // Redirect to user-specific route
    }
  }
}
