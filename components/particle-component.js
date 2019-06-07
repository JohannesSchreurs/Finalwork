const repeater = new AFRAME.registerComponent('repeater', {
    
    repeatedElement: null,
    context: [],

    schema: {
        amount: {
            type: 'int'
        }
    },

    init: function () {
        this.repeatedElement = this.el.children;
        console.log(this.repeatedElement.item(0));

        for(let i = 0; i < this.data.amount; i++) {
            this.el.appendChild(this.repeatedElement.item(0));
        }
        console.log(this.el);
    }
});

export default repeater;