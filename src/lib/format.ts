// 1 -> "01", as in the "(01/05)" counters
export const padNumber = (value: number) => String(value).padStart(2, '0')

// Fills "{name}"-style placeholders of a dictionary text: ("Hi, {name}!", { name: 'Ann' }) → "Hi, Ann!"
export const fillTemplate = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (placeholder, key: string) => values[key] ?? placeholder)
