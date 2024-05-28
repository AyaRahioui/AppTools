import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HotToastService } from '@ngneat/hot-toast';
import * as moment from 'moment';
import 'moment/locale/fr';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  submitted: boolean = false;
  showForm: boolean = false;
  grps: any[] = [];
  currentGroupId = "";
  isUpdateMode = false;
  daysInMonth: moment.Moment[] = [];
  ResultArray: any[] = [];
  isResultLoaded = false;

  name: string = "";
  currentResultID = "";
  currentMonth: moment.Moment;
  today: moment.Moment;
  backgroundColors: string[] = ['#ffce52', '#4ec0e9', '#ed5464'];

  constructor(private http: HttpClient, private toast: HotToastService) {
    this.currentMonth = moment();
    this.today = moment();
    this.generateDaysInMonth();
  }

  ngOnInit(): void {}

  generateDaysInMonth(): void {
    const daysInMonth = this.currentMonth.daysInMonth();
    const monthYear = this.currentMonth.format('YYYY-MM');
    this.daysInMonth = [];

    for (let day = 1; day <= daysInMonth; day++) {
      this.daysInMonth.push(moment(`${monthYear}-${day}`, 'YYYY-MM-DD'));
    }
  }

  getDayBackgroundColor(day: moment.Moment): string {
    const dayIndex = day.date() % this.backgroundColors.length;
    return this.backgroundColors[dayIndex];
  }

  isToday(day: moment.Moment): boolean {
    return day.isSame(this.today, 'day');
  }

  


  setUpdate(data: any) {
    this.showForm = !this.showForm;
    this.name = data.name;
    this.currentResultID = data.id;
    this.isUpdateMode = true;
  }

  formatDateForLink(day: moment.Moment): string {
    return day.format('YYYY-MM-DD');
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
    console.log('Formulaire soumis!');
    this.cancelForm();
  }

  cancelForm(): void {
    this.showForm = false;
    this.reset();
  }

  changeMonth(monthChange: number): void {
    const newMonth = this.currentMonth.clone().add(monthChange, 'month');
    const minDate = moment('2024-05-01');

    if (newMonth.isBefore(minDate, 'month')) {
      return;
    }

    this.currentMonth = newMonth;
    this.generateDaysInMonth();
  }

  getDaysInMonth(): number {
    return this.currentMonth.daysInMonth();
  }
}
