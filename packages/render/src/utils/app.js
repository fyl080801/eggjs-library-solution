const app = document.getElementById('app')

export const prefix = app.getAttribute('data-prefix') || ''

export const external = app.getAttribute('data-external') || undefined
