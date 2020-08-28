import ApiService from "~/common/api.service";

import {
  mapGetters
} from "vuex"

export default {
  data() {
    return {
      phone: ' ',
      mask: ['+375', '(', /\d/, /\d/, ')', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, ],
      code: ' ',
      loadingSendSms: false,
      smsSuccess: false,
      checkCode: false,
      badCode: false,
      currentRouteName: null,
      errorMsg: '',
      current: true,
      timer: 59,
      showAuthForm: false,
    }
  },
  methods: {
    showCurrnet() {
      this.current = !this.current
      if (this.current) {
        this.auth()
      } else {
        this.sendSms()
      }
    },
    changePhoneNumber() {
      this.smsSuccess = false
    },
    sendSmsAgain() {
      this.sendSms()
    },
    closeForm() {
      this.$emit('closeForm')
    },
    sendSms() {
      this.timer = 59
      this.loadingSendSms = true
      ApiService.post('/user/send_sms', {
        phone: parseInt(this.phone.replace(/[^\d]/g, '')),
      }).then((response) => {
        this.loadingSendSms = false
        this.smsSuccess = true
        if (response.data.status == 'err') {
          this.badCode = true
          this.errorMsg = response.data.errors[0]
        }
      }).catch((error) => {
        console.error(error)
      })
      setInterval(() => {
        if (this.timer !== 0) {
          this.timer--
        }
      }, 1000);
    },
    auth() {
      this.checkCode = true
      ApiService.post('/user/auth', {
        phone: parseInt(this.phone.replace(/[^\d]/g, '')),
        code: parseInt(this.code),
      }).then((response) => {
        if (response.data.status == 'err') {
          this.badCode = true
          this.checkCode = false
          this.errorMsg = response.data.error[0]
        } else {
          this.goToCheckout()
        }
      }).catch((error) => {
        console.error(error)
      })
    },
    goToCheckout() {
      this.$store.dispatch('user/setUserPhoneNumber', parseInt(this.phone.replace(/[^\d]/g, '')));
      console.log('goToCheckout -> this.currentRouteName', this.currentRouteName)
      if (this.currentRouteName == 'restik') {
        this.$router.push('/checkout')
      } else {
        console.error('need close');
        this.$emit('closeFormShowOrderForm')
      }
    },
  },
  watch: {
    phone(newValue, oldValue) {
      return newValue
    }
  },
  computed: {
    ...mapGetters({
      getUserPhoneNumber: "user/getUserPhoneNumber",
    }),
  },
  mounted() {
    this.currentRouteName = this.$route.name
  },
}
