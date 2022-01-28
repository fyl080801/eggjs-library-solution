import axios from 'axios';

const app = document.getElementById('app');

export const request = axios.create({
  baseURL: app.getAttribute('data-prefix') || undefined,
});
