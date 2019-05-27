//Handles the sound for the experience

const soundManager = new AFRAME.registerComponent('sound-manager', {

    init: function () {
        console.log(this.el);
    }
});

export default soundManager;