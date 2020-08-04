<template>
<v-card width="20vw" class="pa-3" color="#f5f5f5">
    <v-card-title class="card-title" >
        Ваш заказ
        <v-icon @click="closeCheckout()" color="#000">
            close
        </v-icon>
    </v-card-title>
    <v-card-subtitle color="#000">
        Телефон для связи
    </v-card-subtitle>
    <div>
        <v-text-field type="number" v-model="phone" placeholder="+375" required></v-text-field>
    </div>
    <div>
        <v-text-field v-model="delivery.address" placeholder="Адресс" required></v-text-field>
    </div>
    <div class="d-flex flex-row pa-3">
        <v-text-field type="number" v-model="delivery.enterence" placeholder="Подъезд" required></v-text-field>
        <v-text-field type="number" v-model="delivery.flor" placeholder="Этаж" required></v-text-field>
        <v-text-field type="number" v-model="delivery.flatNum" placeholder="Номер квартиры" required></v-text-field>
    </div>
    <v-card-subtitle color="#000">
        Выберете способ оплаты
    </v-card-subtitle>
    <div>
        <v-radio-group v-model="payment_method" :mandatory="false">
            <v-radio label="Наличными" value="1"></v-radio>
            <v-radio label="Банковской картой на сайте" value="0"></v-radio>
        </v-radio-group>
    </div>
    <v-card-subtitle color="#000">
        Комментарий
    </v-card-subtitle>
    <div class="pa-3">
        <v-textarea name="comment" dense max-height="50px" v-model="comment" clearable></v-textarea>
    </div>
    <v-card-actions>
        <v-btn block color="primary" @click="sendOrder()">Заказать</v-btn>
    </v-card-actions>
</v-card>
</template>

<script>
import {
    mapGetters
} from "vuex";
export default {
    data() {
        return {
			phone: '',
			delivery:{
				address: '',
				room: '',
				flatNum: '',
				enterence: '',
				intercom: '',
				flor: '',
			},
			payment_method:'1',
			promocode:'',
			order:[],
        }
	},
	methods: {
		closeCheckout() {
			this.$emit('closeCheckout')
		},
		sendOrder(){
			console.log(this.getSelectedDishs);
			let dishId;
			let dishOption =[];
			this.getSelectedDishs.forEach((dish) =>{
					dishId = dish.selectSize.id
					if (dish.hasOwnProperty('selectOption')) {
						dish.selectOption.forEach((option) =>{
							dishOption.push(option.id)
						})
					}
					let result ={
						id:dishId,
						options:dishOption
					}
					this.order.push(result)
				}
			)
			console.error('ORDER',this.order);
		}
	},
    computed: {
        ...mapGetters({
            getSelectedZone: "zone/getSelectedZone",
            getSelectedDishs: "basket/getSelectedDishs",
            getTotalPrice: "basket/getTotalPrice",
            getCurrentAddress: "map/getCurrentAddress",
        }),
	},
	mounted () {
		if (this.getCurrentAddress.length > 0) {
			this.delivery.address = this.getCurrentAddress
		}
	},
}
</script>

<style scoped>
.card-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    color: black;
}
</style>
