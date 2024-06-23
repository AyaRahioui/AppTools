import { Injectable } from '@angular/core';
import { DateAdapter } from '@angular/material/core';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {
  private _locale: string = 'fr';

  constructor(private _adapter: DateAdapter<any>) {
    this._adapter.setLocale(this._locale); // Set default locale
  }

  setLocale(locale: string) {
    this._locale = locale;
    this._adapter.setLocale(this._locale);
  }

  getLocale(): string {
    return this._locale;
  }

  formatDate(date: Date, format: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    if (format === 'DD/MM/YYYY') {
      return new Intl.DateTimeFormat('fr-FR', options).format(date);
    } else if (format === 'YYYY/MM/DD') {
      return new Intl.DateTimeFormat('ja-JP', options).format(date);
    }
    return date.toISOString().substring(0, 10); // Default ISO format
  }
}
