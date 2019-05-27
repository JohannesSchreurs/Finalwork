AFRAME.registerComponent('scene-transition', {

    overlay: null,
    children: null,

    schema: {
        time: {
            type: 'array'
        }
    },
  
    init: function () {
      this.index = 0;
      this.overlay = document.getElementById('overlay');
      this.children = [...this.el.children];
    },
  
    tick: function (time) {
      var self = this;
      
      this.overlay.components.material.material.opacity -= 0.027;

      setTimeout(() => {
        if (time - this.time < self.data.time[self.index]) { return; }
        this.time = time;
        this.children.forEach(child => {
            if (child.hasAttribute('visible')) {
                child.setAttribute('visible', 'false');
            }
        })

        this.children[self.index].setAttribute('visible', 'true');
        self.index++;
        this.overlay.components.material.material.opacity = 1;
        if(self.index === this.children.length) self.index = 0;
      }, self.data.time[self.index]);
    }
});