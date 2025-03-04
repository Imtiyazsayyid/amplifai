export function getIntOrNull(value: any): number | null {
  const parsed = parseInt(value);
  return isNaN(parsed) ? null : parsed;
}

export function getIntOrUndefined(value: any): number | undefined {
  const parsed = parseInt(value);
  return isNaN(parsed) ? undefined : parsed;
}
