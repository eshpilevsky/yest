import { getAddresFromGeoobject, getAddresByCoords } from '@/common/lib/map'

const getLocation = async ({ commit }) => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (location) => {
                const { latitude, longitude } = location.coords
                commit('SET_CURRENT_COORDS', [latitude, longitude])
                resolve()
            },
            () => {
                commit('SET_GEOLOCATION_DENIED')
                commit('SET_INPUT_ADDRESS_MODE')
                reject()
            }
        )
    })
}
const getGeoObjects = async ({ commit }, { ymaps, coords }) => {
    const currentAddress = await getAddresByCoords(ymaps, coords)
    commit('SET_CURRENT_ADDRESS', currentAddress)
    commit('SET_CURRENT_COORDS', coords)
    commit('HIDE_MAP')
}
export default {
  getLocation,
  getGeoObjects
}
