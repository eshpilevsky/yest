import axios from 'axios'

export const getAddresFromGeoobject = (geoObjects) => {
  return getAddressFromString(geoObjects.get(0).properties.get('metaDataProperty').GeocoderMetaData.text)
}

export const getAddressFromString = (text) => {
  return text.split(',').slice(2).join(',')
}

export const getAddresByCoords = async (ymaps, coords, zoneList, selectedZone, router) => {
  let getCityGeocoder;
  let addressMass;
  let buffer
  const myReverseGeocoder = await ymaps.geocode(coords, {
    results: 1,
    boundedBy: [
      [51.753588, 23.148098],
      [55.591263, 31.491889]
	],
	strictBounds: true,
  }).then((geo) => {
    const geoObjects = geo.geoObjects.get(0)
    getCityGeocoder = geoObjects.properties.get('metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.Locality.LocalityName')
    addressMass = geoObjects.properties.get('metaDataProperty.GeocoderMetaData.Address.Components')

    return buffer = geo.geoObjects
  })
    return {
		address: getAddresFromGeoobject(buffer),
		position: addressMass
	}
}
