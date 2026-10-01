import { Component, computed, input, model } from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';
import { MONTH_NAMES } from './format-date-range';

function parse(value: string | null): { month: number | null; year: number | null } {
  if (!value) {
    return { month: null, year: null };
  }
  const [year, month] = value.split('-').map(Number);
  return { month, year };
}

function toIsoDate(month: number, year: number): string {
  return `${year}-${String(month).padStart(2, '0')}-01`;
}

/**
 * Month+year picker (day is always the 1st). Implements Signal Forms'
 * FormValueControl<string | null> contract — binds via [formField] like a
 * native input. With `allowOngoing`, an extra "en cours" option clears the
 * value to null instead of requiring a month/year pair.
 */
@Component({
  selector: 'app-month-year-picker',
  templateUrl: './month-year-picker.component.html',
})
export class MonthYearPickerComponent implements FormValueControl<string | null> {
  readonly value = model<string | null>(null);
  readonly allowOngoing = input(false);

  protected readonly months = MONTH_NAMES.map((label, index) => ({ value: index + 1, label }));
  protected readonly years = (() => {
    const currentYear = new Date().getFullYear();
    const list: number[] = [];
    for (let year = currentYear + 1; year >= 1990; year--) {
      list.push(year);
    }
    return list;
  })();

  protected readonly ongoing = computed(() => this.value() === null);
  protected readonly selectedMonth = computed(() => parse(this.value()).month);
  protected readonly selectedYear = computed(() => parse(this.value()).year ?? new Date().getFullYear());

  protected onMonthChange(month: number): void {
    this.value.set(toIsoDate(month, this.selectedYear()));
  }

  protected onYearChange(year: number): void {
    this.value.set(toIsoDate(this.selectedMonth() ?? 1, year));
  }

  protected onOngoingChange(isOngoing: boolean): void {
    this.value.set(isOngoing ? null : toIsoDate(this.selectedMonth() ?? 1, this.selectedYear()));
  }
}
