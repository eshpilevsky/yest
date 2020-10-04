import {
  getAddresFromGeoobject,
  getAddresByCoords
} from '@/common/lib/map'
import * as Cookie from 'js-cookie'
import axios from 'axios'

export const state = () => ({
  data: {
    visible: false,
    currentCoords: [],
    inputAddressMode: false,
    address: '',
    addressMass: [],
    geolocationDenied: false,
    loading: true,
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

  async getGeoObjects({commit}, {
	ymaps,
	coords,
	getZoneList,
	getSelectedZone,
	router,
}) {
    const currentAddress = await getAddresByCoords(ymaps, coords, getZoneList, getSelectedZone, router)

    console.log(currentAddress);


    console.log('STORE getGeoObjects -->'+currentAddress.address);
    let addressMass = [];
    let getCityGeocoder;

    await ymaps.geocode(currentAddress.address, {
      results: 1,
    }).then((geo) => {
      const geoObjects = geo.geoObjects.get(0);
      getCityGeocoder = geoObjects.properties.get('metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.Locality.LocalityName')
      addressMass = geoObjects.properties.get('metaDataProperty.GeocoderMetaData.Address.Components');

      let adr = '';
      addressMass.forEach((block)=>{
        switch (block.kind) {
          case 'street':
            adr += block.name;
            break;
          case 'house':
            adr += ', '+block.name;
            break;
        }
      });

      commit('SET_CURRENT_COORDS',  geoObjects.geometry.getCoordinates());
      commit('SET_CURRENT_ADDRESS', adr);
      commit('SET_ADDRESS_MASS', addressMass);
    });


    // commit('SET_CURRENT_ADDRESS', currentAddress.address)
	  // commit('SET_CURRENT_COORDS', coords)


	let cityId = await axios.post('https://yestapi.xyz/check_delivery_address', currentAddress.position).then(res => {
		return res.data.city_id
	});
	if (getSelectedZone.id !== cityId) {
		let findCity = getZoneList.find((zone) => {
			return zone.id == cityId
		})
		if (findCity !== undefined) {
			router.push(`/${findCity.alias}`)
		} else {
			router.push(`/`)
		}
	}

    commit('HIDE_MAP')
  },

  dropLocation({
    commit
  }) {
    commit('SET_CURRENT_ADDRESS', null)
    commit('SET_CURRENT_COORDS', null)
  },

  async setCurrentAddress(context, payload) {
    console.log('STORE setCurrentAddress -->'+payload);
    let addressMass = [];
    let getCityGeocoder;

    await ymaps.geocode(payload, {
      results: 1,
    }).then((geo) => {
      const geoObjects = geo.geoObjects.get(0);
      getCityGeocoder = geoObjects.properties.get('metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.Locality.LocalityName')
      addressMass = geoObjects.properties.get('metaDataProperty.GeocoderMetaData.Address.Components');

      let adr = '';
      addressMass.forEach((block)=>{
        switch (block.kind) {
          case 'street':
            adr += block.name;
            break;
          case 'house':
            adr += ', '+block.name;
            break;
        }
      });

      context.commit('SET_CURRENT_COORDS',  geoObjects.geometry.getCoordinates());
      context.commit('SET_CURRENT_ADDRESS', adr);
      context.commit('SET_ADDRESS_MASS', addressMass);
    });

  },


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
          // alert(this.state)
        }, 5000);
        permissionStatus.onchange = function () {
          if (this.state == 'prompt') {
            state.data.loading = true
          } else if (this.state == 'granted') {
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
  SET_ADDRESS_MASS(state, addressMass) {
    state.data.addressMass = addressMass;
  },
  SET_CURRENT_COORDS(state, coords) {
    console.log('SET_CURRENT_COORDS',coords);
    if (coords == null) {
      state.data.currentCoords = []
      state.data.address = ''
      Cookie.remove('latitude')
      Cookie.remove('longitude')
      Cookie.remove('address')
    } else {
      state.data.currentCoords = coords
      Cookie.set('latitude', coords[0])
      Cookie.set('longitude', coords[1])
    }
  },
  SET_CURRENT_ADDRESS(state, address) {
    if (address == null) {
      state.data.address = ''
      state.data.currentCoords = []
      Cookie.remove('latitude')
      Cookie.remove('longitude')
      Cookie.remove('address')

    } else {
      // Установить адрес
      state.data.address = address;


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
  },
  getAddressMass(state){
    return state.data.addressMass;
  }
};

export const strict = false
