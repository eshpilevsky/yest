<template>
<div>
    <div :class="{active:current}">
        <v-text-field class="sms-modal__field" label="Ваш номер телефона" outlined v-model="phone" v-mask="mask" ></v-text-field>
        <v-btn class="sms-modal__submit" block color="primary" :disabled="code.length < 5" @click="auth()">
            Получить код
        </v-btn>
    </div>
    <div :class="{active:!current}">
        <v-text-field class="sms-modal__field" label="Код из смс" outlined v-model="code"></v-text-field>
        <v-btn class="sms-modal__submit" block color="primary" :disabled="code.length < 5" @click="auth()">
            Готово
        </v-btn>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
			code: ' ',
            phone: ' ',
			mask: ['+375', '(', /\d/, /\d/, ')', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, ],
			current: true,
        }
	},
	methods: {
		auth() {
			this.current = !this.current
		}
	},
}
</script>

<style scoped>

</style>
