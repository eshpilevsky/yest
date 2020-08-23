import {
  getAddresFromGeoobject,
  getAddresByCoords
} from '@/common/lib/map'
import * as Cookie from 'js-cookie'

export const state = () => ({
  data: {
    visible: false,
    currentCoords: [],
    inputAddressMode: false,
    address: '',
    geolocationDenied: false,
    loading: false,
  },
  status: 0
})

export const actions = {

  async getLocation({
    commit
  }) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (location) => {
          const {
            latitude,
            longitude
          } = location.coords
          commit('SET_CURRENT_COORDS', [latitude, longitude])
          resolve(true)
        },
        () => {
          resolve(false)
          commit('SET_GEOLOCATION_DENIED')
          commit('SET_INPUT_ADDRESS_MODE')

          //   reject()
        }
      )
    })
  },
  async getGeoObjects({
    commit
  }, {
    ymaps,
    coords
  }) {
    const currentAddress = await getAddresByCoords(ymaps, coords)
    commit('SET_CURRENT_ADDRESS', currentAddress)
    commit('SET_CURRENT_COORDS', coords)
    commit('HIDE_MAP')
  }
};


export const mutations = {
  async SHOW_MAP(state) {
    state.data.visible = true
    await navigator.geolocation.getCurrentPosition((pos) => {
      const crd = pos.coords
      const latitude = crd.latitude
      const longitude = crd.longitude
      state.data.currentCoords[0] = latitude
      state.data.currentCoords[1] = longitude
    }, (error) => {
      console.warn(`ERROR(${error.code}): ${error.message}`)
      state.data.inputAddressMode = true
    }, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    })

    navigator.permissions.query({
        name: 'geolocation'
      })
      .then(function (permissionStatus) {
        setInterval(() => {
          alert(this.state)
        }, 5000);
        permissionStatus.onchange = function () {
          if (this.state == 'prompt') {
            state.data.loading = true
          } else if (this.state == 'granted') {
            state.data.loading = false
            setTimeout(() => {

            }, 5000);
          } else if (this.state == 'denied') {
            state.data.loading = false
            state.data.inputAddressMode = true
          }
        };
      });
  },
  HIDE_MAP(state) {
    state.data.visible = false
  },
  SET_CURRENT_COORDS(state, coords) {
    if(coords == null){
      state.data.currentCoords = []
      state.data.address = ''
    } else{
      state.data.currentCoords = coords
      Cookie.set('coords', coords)
      Cookie.set('latitude', coords[0])
      Cookie.set('longitude', coords[1])

    }
  },
  SET_CURRENT_ADDRESS(state, address) {
    if (address == null) {
      state.data.address = ''
      state.data.currentCoords = []
    } else {
      state.data.address = address
      console.log("SET_CURRENT_ADDRESS -> address", address)
      Cookie.set('address', address)

    }
  },
  SET_INPUT_ADDRESS_MODE(state) {
    state.data.inputAddressMode = true
  },
  UNSET_INPUT_ADDRESS_MODE(state) {
    state.data.inputAddressMode = false
  },
  SET_GEOLOCATION_DENIED(state) {
    state.data.geolocationDenied = true
  },
  LOADF(state) {
    state.data.loading = false
  }
};

export const getters = {
  isMapVisible(state) {
    return state.data.visible
  },
  getCurrentCoords(state) {
  //   function getCookie(cookieName, stringCookie) {
  //     let strCookie = new RegExp('' + cookieName + '[^;]+').exec(stringCookie)[0]
  //     return unescape(strCookie ? strCookie.toString().replace(/^[^=]+./, '') : '')
  // }
  //   let latitude = getCookie('latitude')
  //   let longitude = getCookie('longitude')
    
  //   console.log("getCurrentCoords -> latitude", latitude)
  //   console.log("getCurrentCoords -> longitude", longitude)
  //   let coords = [latitude,longitude]
    // let coords = Cookie.get('coords')
    // return coords
    // return [latitude,longitude]
    return state.data.currentCoords
  },
  getCurrentAddress(state) {
    return state.data.address
  },
  geolocationAvailable(state) {
    return !state.data.geolocationDenied
  },
  getMapLoading(state) {
    return state.data.loading
  },
  isInputAddressMode(state) {
    return state.data.inputAddressMode
  }
};

export const strict = false
