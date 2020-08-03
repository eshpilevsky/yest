<template>
<v-card width="20vw" dark class="pa-3">
    <v-card-title class="card-title" >
        Ваш заказ
        <v-icon @click="this.$emit('closeCheckout')" color="#000">
            close
        </v-icon>
    </v-card-title>
    <v-card-subtitle color="#000">
        Телефон для связи
    </v-card-subtitle>
    <div>
        <v-text-field v-model="phone" label="+375" required></v-text-field>
    </div>
    <div>
        <v-text-field v-model="phone" label="Адресс" required></v-text-field>
    </div>
    <div class="d-flex flex-row">
        <v-text-field dark v-model="entrance" label="Подъезд" required></v-text-field>
        <v-text-field v-model="floor" label="Этаж" required></v-text-field>
        <v-text-field v-model="flatNum" label="Номер квартиры" required></v-text-field>
    </div>
    <v-card-subtitle color="#000">
        Выберете способ оплаты
    </v-card-subtitle>
    <div>
        <v-radio-group v-model="paymentType" :mandatory="false">
            <v-radio label="Наличными" value="1"></v-radio>
            <v-radio label="Банковской картой на сайте" value="0"></v-radio>
        </v-radio-group>
    </div>
    <v-card-subtitle color="#000">
        Комментарий
    </v-card-subtitle>
    <div>
        <v-textarea name="comment" height="100%" v-model="comment" clearable></v-textarea>
    </div>
    <v-card-actions>
        <v-btn block color="primary">Заказать</v-btn>
    </v-card-actions>
</v-card>
</template>

<script>
export default {
    data() {
        return {
            phone: '',
            entrance: '',
            floor: '',
            flatNum: '',
            comment: '',
            paymentType: '',
        }
    },
    mounted() {
        // this.paymentType;
        this.$vuetify.theme.dark = false
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
