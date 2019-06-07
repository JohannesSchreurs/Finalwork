//Import our needed js files
import Loader from './Classes/Loader.js';
import sceneManager from '../components/scene-manager.js';
import repeater from '../components/particle-component.js';
import soundManager from '../components/sound-manager.js';
import cursorListener from '../components/cursor-listener.js'

//Register the modules in our loader class
Loader.registerModules(
    sceneManager,
    repeater,
    soundManager,
    cursorListener
);

//Append the JS to the DOM if it's done loading
if (document.readyState !== 'loading') {
    Loader.initModules();
} else {
    document.addEventListener('DOMContentLoaded', () => Loader.initModules());
}
