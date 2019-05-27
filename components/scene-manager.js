AFRAME.registerComponent('scene-manager', {

    amountOfModelsLoaded: 0,
    loaded: false,
    loading: false,
    overlay: null,
    overlayText: null,
    fade: null,
    children: null,

    schema: {
        amount: {
            type: 'int'
        },
        time: {
            type: 'array'
        }
    },

    init: function () {
        this.overlay = document.querySelector('.js-overlay');
        this.overlayText = document.querySelector('.js-loading-text');
        this.fade = document.getElementById('overlay');
        this.el.addEventListener('model-loaded', () => {
            this.loading = true;
        })
        this.index = 0;
        this.children = [...this.el.children];
    },

    tick: function (time) {
        let self = this;

        //preview start
        if(this.loading) {
            this.overlayText.innerHTML = 'Loading assets: ' + this.amountOfModelsLoaded++ + '/' + this.data.amount;
        }

        if(!this.loaded) {
            if (this.amountOfModelsLoaded === this.data.amount) {
                this.overlay.classList.add('hidden');
                this.loading = false;
                this.loaded = true;
            }
        }

        //main loop
        if (this.loaded) {
            
            this.fade.components.material.material.opacity -= 0.027;

            setTimeout(() => {
                if (time - this.time < self.data.time[self.index]) { return; }
                this.time = time;
                this.children.forEach(child => {
                    if (child.hasAttribute('visible')) {
                        child.setAttribute('visible', 'false');
                    }
                })
                console.log(self.data.time[self.index]);

                this.children[self.index].setAttribute('visible', 'true');
                self.index++;
                this.fade.components.material.material.opacity = 1;
                if(self.index === this.children.length) self.index = 0;
            }, self.data.time[self.index]);
        }
    }
})