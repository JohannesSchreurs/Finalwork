//Particle component to emit particles

const particleEffect = new AFRAME.registerComponent('particle', {
    
    init: function () {
        console.log(this.el);
    }
});

export default particleEffect;