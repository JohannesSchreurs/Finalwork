AFRAME.registerComponent('scene-loader', {

    amountOfModelsLoaded: 0,
    loaded: false,
    loading: false,
    overlay: null,
    overlayText: null,

    schema: {
        amount: {
            type: 'int'
        }
    },

    init: function () {
        this.overlay = document.querySelector('.js-overlay');
        this.overlayText = document.querySelector('.js-loading-text');
        this.el.addEventListener('model-loaded', () => {
            this.loading = true;
        })
    },

    tick: function () {
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
    }
})
