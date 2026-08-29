export const countries = [
  { code: 'US', name: 'United States' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'PL', name: 'Poland' },
  { code: 'DE', name: 'Germany' },
  { code: 'GB', name: 'Great Britain' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'CA', name: 'Canada' },
]

export function renderCountrySelect(selectElement) {
  countries.forEach(({ code, name }) => {
    const option = document.createElement('option')
    option.value = code;
    option.textContent = name;
    selectElement.appendChild(option)
  })
}