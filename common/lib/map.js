export const getAddresFromGeoobject = (geoObjects) => {
  return getAddressFromString(geoObjects.get(0).properties.get('metaDataProperty').GeocoderMetaData.text)
}

export const getAddressFromString = (text) => {
  return text.split(',').slice(2).join(',')
}

export const getAddresByCoords = async (ymaps, coords, zoneList, selectedZone, router) => {
  const myReverseGeocoder = await ymaps.geocode(coords, {
    results: 1,
    boundedBy: [
      [51.753588, 23.148098],
      [55.591263, 31.491889]
    ],
  }).then((res) => {
	let address=''
    let getCityGeocoder = res.geoObjects.get(0).properties.get('metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.Locality.LocalityName')
    if (selectedZone.name !== getCityGeocoder) {
      let findCity = zoneList.find((zone) => {
        return zone.name == getCityGeocoder
      })
      if (findCity !== undefined) {
        router.push(`/${findCity.alias}`)
      } else {
        router.push(`/`)
      }
    } else {
      address = getAddresFromGeoobject(res.geoObjects)
      console.log('getAddresByCoords -> address', address)
	  return address;
    }
  })
  return myReverseGeocoder

}
