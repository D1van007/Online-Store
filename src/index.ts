import { App } from './components/app/app';
import '../node_modules/@fortawesome/fontawesome-free/css/all.css';
import { eventedPushState } from './components/router/events_history';

new App();

document.querySelector('.main-link')?.addEventListener('click', (e: Event) => {
  e.preventDefault();
  eventedPushState({}, '', '/');
});
document.querySelector('.cart-link')?.addEventListener('click', (e: Event) => {
  e.preventDefault();
  eventedPushState({}, '', '/cart');
});

new URL(window.location.href);
