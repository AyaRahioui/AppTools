import { Component, OnInit } from '@angular/core';
import { ReminderService } from '../services/reminder.service';

@Component({
  selector: 'app-reminders',
  templateUrl: './reminders.component.html',
  styleUrls: ['./reminders.component.css']
})
export class RemindersComponent implements OnInit {

  reminders: any[] = [];

  constructor(private reminderService: ReminderService) { }

  ngOnInit(): void {
    this.loadReminders();
  }

  loadReminders(): void {
    this.reminderService.getDueReminders().subscribe(data => {
      this.reminders = data;
    });
  }
}
