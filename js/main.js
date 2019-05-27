//Import our needed js files
import Loader from '../components/Classes/Loader.js';
import sceneManager from '../components/scene-manager.js';
import particleEffect from '../components/particle-component.js';
import soundManager from '../components/sound-manager.js';

//Register the modules in our loader class
Loader.registerModules(
    sceneManager,
    particleEffect,
    soundManager
);

//Append the JS to the DOM if it's done loading
if (document.readyState !== 'loading') {
    Loader.initModules();
} else {
    document.addEventListener('DOMContentLoaded', () => Loader.initModules());
}
