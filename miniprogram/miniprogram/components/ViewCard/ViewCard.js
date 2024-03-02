Component({
    properties: {
        data: Object,
        handle: Boolean
    },
    methods: {
        toDelete(e) {
            const { id } = e.currentTarget.dataset;
            this.triggerEvent('getdelete', id);
        },
        toUpdate(e) {
            const { info } = e.currentTarget.dataset;
            this.triggerEvent('getupdate', JSON.stringify(info));
        }
    }
})