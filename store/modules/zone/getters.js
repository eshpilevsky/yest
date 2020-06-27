const getSelectedZone = (state) => {
  const zones = state.data.zone
  let find = {
    alias: 'minsk',
    id: 1,
    name: 'Минск'
  }
  if (zones !== null) {
    zones.forEach((element) => {
      if (element.id === (state.data.selectedZoneId == null ? 0 : state.data.selectedZoneId)) {
        find = element
      }
    })
  }
  return find
}

const getZoneList = (state) => {
  return state.data.zone
}

export default {
  getSelectedZone,
  getZoneList
}
