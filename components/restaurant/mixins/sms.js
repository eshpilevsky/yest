import ApiService from "~/common/api.service";

import {
  mapGetters
} from "vuex"

export default {
  props: {
    smsFormCurrent: Boolean,
  },
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
      timer: '',
      calcTime: 0,
      showAuthForm: false,
    }
  },
  methods: {
    expiresTimer() {
      var currentTime = new Date().getTime()
      this.calcTime = this.getSmsTimer - currentTime
      var min = Math.floor((this.calcTime / 1000 / 60) << 0)
      var sec = Math.floor((this.calcTime / 1000) % 60)
      this.timer = `${min}:${sec > 10 ? `${sec}`: `0${sec}`}`
    },
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
      var currentTimee = new Date().getTime()

      this.loadingSendSms = true
      ApiService.post('/user/send_sms', {
        phone: parseInt(this.phone.replace(/[^\d]/g, '')),
      }).then((response) => {
        this.loadingSendSms = false
        this.smsSuccess = true

        if (response.data.status == 'err') {
          this.badCode = true
          this.errorMsg = response.data.errors[0]
          setInterval(() => {
            if (currentTimee < this.getSmsTimer) {
              this.expiresTimer()
            }
          }, 1000);
        } else {
          let currentTime = new Date(new Date().getTime() + 5 * 60000).getTime();
          ym(67033669,'reachGoal','PhoneNumberEntered')
          this.$store.dispatch('user/setSmsTimer', currentTime);
        }
      }).catch((error) => {
        console.error(error)
      })

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
          ym(67033669,'reachGoal','SMScodeEntered')
          this.goToCheckout();
        }
      }).catch((error) => {
        console.error(error)
      })
    },
    goToCheckout() {
      this.$store.dispatch('user/setUserPhoneNumber', parseInt(this.phone.replace(/[^\d]/g, '')));
      if (this.currentRouteName == 'restik') {
        this.$router.push('/checkout')
      } else {
        console.error('need close');
        this.$emit('closeFormShowOrderForm')
      }
    },
  },
  computed: {
    ...mapGetters({
      getUserPhoneNumber: "user/getUserPhoneNumber",
      getSmsTimer: "user/getSmsTimer",
    }),
  },
  watch: {
    phone(newValue) {
      return newValue
    },
    current(newValue) {
      this.$emit('currentForm', newValue)
      return newValue
    },
    smsFormCurrent(newValue) {
      this.current = newValue
      this.$emit('currentForm', newValue)
      return newValue
    },
  },
  mounted() {
    this.current = this.smsFormCurrent
    this.currentRouteName = this.$route.name
  },
}
