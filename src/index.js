import './style.css';
import Gif from './assets/impatient.gif';
import Application from './c-modules.js/app.js';

const application = new Application();
application.initApp();

const wait = document.querySelector('.loading');
wait.src = Gif;