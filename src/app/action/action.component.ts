import { Component, OnInit } from '@angular/core';
import { ReminderService } from '../services/reminder.service';
import { ResultService } from '../services/result.service';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['../admin/admin.component.css', '../reminders/reminders.component.css']
})
export class ActionComponent implements OnInit {
  reminders: any[] = [];
  resultNames: { [key: number]: string } = {};

  constructor(
    private reminderService: ReminderService,
    private resultService: ResultService
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
}
