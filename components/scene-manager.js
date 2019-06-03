//Scene Manager component
//1. This component will load in all the assets needed to run the experience,
//2. Display the loading screen and the end screen (as they follow up on the scenes)
//3. Start the loop to display the scenes in a sequence

const sceneManager = new AFRAME.registerComponent('scene-manager', {

    amountOfModelsLoaded: 0,
    loaded: false,
    loading: false,
    overlay: null,
    overlayText: null,
    fade: null,
    children: null,
    playNextScene: false,
    finished: false,
    soundtrack: null,

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
        this.soundtrack = document.getElementById('soundtrack');
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
    },


    //Sometimes we will need do some custom stuff to the scene in the scene, so this function does just that
    changeBasedOnScene: function (index, callback) {
        if (this.index === index) {
            callback();
        }
    }
});

export default sceneManager;