AFRAME.registerComponent('scene-manager', {

    amountOfModelsLoaded: 0,
    loaded: false,
    loading: false,
    overlay: null,
    overlayText: null,
    fade: null,
    children: null,
    playNextScene: false,
    finished: false,

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
        if (this.loaded && !this.finished) {
            
            this.fade.components.material.material.opacity -= 0.027;
            if (time - this.time < this.data.time[this.index]) { 
                this.playNextScene = false;
                return;
            } else {
                this.playNextScene = true;
            }
            this.time = time;

            if (this.playNextScene) {
                this.children.forEach(child => {
                    if (child.hasAttribute('visible')) {
                        child.setAttribute('visible', 'false');
                    }
                })
                this.children[this.index].setAttribute('visible', 'true');
                this.index++;
                this.fade.components.material.material.opacity = 1;
                if(this.index === this.children.length) this.finished = true;
            }
        }

        //end
        if (this.finished) {
            this.overlay.classList.remove('hidden');
            this.overlayText.innerHTML = `Done.`;
        }
    }
})