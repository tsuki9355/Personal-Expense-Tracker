const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

/** 1234.5 -> "$1,234.50" */
export function formatMoney(amount: number): string {
  return currency.format(amount);
}

/** Today's date as "YYYY-MM-DD" in the user's own time zone (the en-CA locale uses that format). */
export function todayIso(): string {
  return new Date().toLocaleDateString('en-CA');
}
