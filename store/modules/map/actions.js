const getLocation = async ({ commit }) => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (location) => {
                const { latitude, longitude } = location.coords
                console.log("getLocation", latitude, longitude)
                commit('SET_CURRENT_COORDS', [latitude, longitude])
                resolve()
            },
            () => {
                commit('SET_INPUT_ADDRESS_MODE')
                reject()
            }
        )
    })
}
const getGeoObjects = async ({ commit }, { ymaps, coords }) => {
    const myReverseGeocoder = await ymaps.geocode(coords)
    const { geoObjects } = myReverseGeocoder
    const currentAddress = geoObjects.get(0).properties.get('metaDataProperty').GeocoderMetaData.text.split(',').slice(2).join(',')
    commit('SET_CURRENT_ADDRESS', currentAddress)
    commit('SET_CURRENT_COORDS', coords)
    commit('HIDE_MAP')
    console.log(geoObjects.get(0).properties.get('metaDataProperty'), currentAddress)
    //  = myReverseGeocoder.then(function (res) {
    //       console.log(coords, res.geoObjects.get(0).properties.get('text'))
    //     })
}
export default {
  getLocation,
  getGeoObjects
}
