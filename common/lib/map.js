export const getAddresFromGeoobject = (geoObjects) => {
    return getAddressFromString(geoObjects.get(0).properties.get('metaDataProperty').GeocoderMetaData.text)
}

export const getAddressFromString = (text) => {
    return text.split(',').slice(2).join(',')
}

export const getAddresByCoords = async (ymaps, coords) => {
    const myReverseGeocoder = await ymaps.geocode(coords)
    const { geoObjects } = myReverseGeocoder
    const address = getAddresFromGeoobject(geoObjects)
    return address;
}