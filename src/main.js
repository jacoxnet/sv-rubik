import { mount } from 'svelte';
import 'bootstrap/dist/css/bootstrap.min.css';
import './cube.css';
import Main from './components/Main.svelte';

const app = mount(Main, { target: document.getElementById('root') });

export default app;
