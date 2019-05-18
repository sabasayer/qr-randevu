const app = new Vue({
    el:'#app',
    data:{
        loading:false,
        isModalVisible:false,
        newData:{
            name:'',
            email:'',
            phone:''
        },
        items:[

        ],
        qr:''
    },
    mounted:async function(){
        this.loading = true;
        let res = await axios.get('/list');
        this.items = res.data;
        this.loading = false;
    },
    methods:{
        open_modal:function(item){
            this.qr = item.qr;
            this.isModalVisible = true;
        },
        close_modal:function(){
            this.isModalVisible = false;
        },
        create_randevu:async function(){
            if(this.loading) return;
            this.loading = true;
            let copy = JSON.parse(JSON.stringify(this.newData));
            
            let res = await axios.post('/create',{data:copy});
            copy = res.data;

            this.items.push(copy);
            this.newData.name = '';
            this.newData.email = '';
            this.newData.phone = '';
            this.loading =false;
        },
        generate:async function(){
            let res = await axios.post('/generate',{data:this.newData});
            this.qr = res.data;
        },
        remove:async function(item){
            let res = await axios.post('/remove',{id:item.id});
            let index = this.items.indexOf(item);
            this.items.splice(index,1);
        }
    }
}) 


