import axios from 'axios';

const app = window.document.getElementById('app');

export const request = axios.create({
  baseURL: app.getAttribute('data-prefix') || undefined,
});
