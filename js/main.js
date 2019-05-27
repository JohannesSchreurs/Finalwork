//Import our needed js files
import Loader from '../components/Classes/Loader.js';
import sceneManager from '../components/scene-manager.js';

//Register the in our loader file
Loader.registerModules(
    sceneManager
);

//Append the JS to the DOM if it's done loading
if (document.readyState !== 'loading') {
    Loader.initModules();
} else {
    document.addEventListener('DOMContentLoaded', () => Loader.initModules());
}
