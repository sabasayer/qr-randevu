Vue.use(VueQrcodeReader)

new Vue({
    el: '#app',

    data() {
        return {
            loading: false,
            decodedContent: '',
            errorMessage: '',
            found: false,
            randevu: {
                id: '',
                name: '',
                email: '',
                phone: ''
            }
        }
    },

    methods: {
        onDecode: async function (content) {
            if (this.loading) return;
            this.loading = true;
            this.decodedContent = content;
            if (content) {
                let res = await axios.post('/check', { id: content });
                if (res.data) {
                    this.randevu = res.data;
                    this.found = true;
                }
                else {
                    this.found = false;
                    this.errorMessage = 'Uygun bir kayıt bulunamadı';
                }
            }

            this.loading = false;
        },

        onInit(promise) {
            promise.then(() => {
                console.log('Successfully initilized! Ready for scanning now!')
            })
                .catch(error => {
                    if (error.name === 'NotAllowedError') {
                        this.errorMessage = 'Hey! I need access to your camera'
                    } else if (error.name === 'NotFoundError') {
                        this.errorMessage = 'Do you even have a camera on your device?'
                    } else if (error.name === 'NotSupportedError') {
                        this.errorMessage = 'Seems like this page is served in non-secure context (HTTPS, localhost or file://)'
                    } else if (error.name === 'NotReadableError') {
                        this.errorMessage = 'Couldn\'t access your camera. Is it already in use?'
                    } else if (error.name === 'OverconstrainedError') {
                        this.errorMessage = 'Constraints don\'t match any installed camera. Did you asked for the front camera although there is none?'
                    } else {
                        this.errorMessage = 'UNKNOWN ERROR: ' + error.message
                    }
                })
        }
    }
})