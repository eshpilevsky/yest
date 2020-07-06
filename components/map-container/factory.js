const typeToIcon = {
  plus: 'add',
  minus: 'remove',
  close: 'close',
  geo: 'near_me',
  iamhere: null,
  place: 'place'
}

export const getBtn = ({
  ymaps,
  mapInstance,
  type,
  clickHandler,
  options
}) => {
  let btn;
  if (typeToIcon[type]) {
    btn = new ymaps.control.Button({
      options: {
        layout: ymaps.templateLayoutFactory.createClass(
          `<div class='customMapBtn ${type}'><i class="material-icons ${typeToIcon[type]}_icon">${typeToIcon[type]}</i><div/>`
        ),
      }
    })
  } else {
    btn = new ymaps.control.Button({
      data: {
        content: options.content
      },
      options: {
        layout: ymaps.templateLayoutFactory.createClass(
          `<div class='customMapBtn ${type}'>{{ data.content }}<div/>`
        )
      }
    })
  }

  mapInstance.controls.add(btn, options)
  if (clickHandler) {
    btn.events.add('click', clickHandler)
  }
  return btn
}

export const getZoomIn = (
  ymaps, mapInstance
) => {
  return getBtn({
    ymaps,
    mapInstance,
    type: 'plus',
    clickHandler: function (event) {
      mapInstance.setZoom(mapInstance.getZoom() + 1, {
        duration: 500
      })
    },
    options: {
      float: 'none',
      position: {
        bottom: '50vh',
        right: '25px'
      }
    }
  })
}

export const getZoomOut = (
  ymaps, mapInstance
) => {
  return getBtn({
    ymaps,
    mapInstance,
    type: 'minus',
    clickHandler: function (event) {
      mapInstance.setZoom(mapInstance.getZoom() - 1, {
        duration: 500
      })
    },
    options: {
      float: 'none',
      position: {
        top: '50vh',
        right: '25px'
      }
    }
  })
}

export const getClose = (
  ymaps, mapInstance, clickHandler
) => {
  return getBtn({
    ymaps,
    mapInstance,
    type: 'close',
    clickHandler,
    options: {
      float: 'left',
    },
    position: {
      top: '3rem',
    }
  })
}

export const getGeo = (
  ymaps, mapInstance, clickHandler
) => {
  const btn = new ymaps.control.GeolocationControl({
    options: {
      float: 'none',
      noPlacemark: true,
      clickHandler,
      layout: ymaps.templateLayoutFactory.createClass(
        `<div class='customGeoBtn myGeo'><i class="material-icons">near_me</i><div/>`
      ),
      position: {
        bottom: '35vh',
        right: '25px'
      }
    }
  })
  btn.events.add('locationchange', function (event) {
    var position = event.get('position'),
      locationPlacemark = new ymaps.Placemark(position);
    mapInstance.panTo(position);
  });
  mapInstance.controls.add(btn)
  btn.events.add('locationchange', function (event) {
    var position = event.get('position')
    myMap.panTo(position)
  });
  return btn
}


export const getIamHere = (
  ymaps, mapInstance, clickHandler
) => {
  return getBtn({
    ymaps,
    mapInstance,
    type: 'iamhere',
    clickHandler,
    options: {
      float: 'none',
      position: {
        bottom: navigator.userAgent.includes('Mac OS') ? '8rem' : '2rem',
        right: '8vw',
      },
      content: 'Я здесь'
    }
  })
}


export const getPlace = (
  ymaps, mapInstance
) => {
  return getBtn({
    ymaps,
    mapInstance,
    type: 'place',
    options: {
      float: 'none',
      position: {
        top: '48vh',
        left: '45vw'
      }
    }
  })
}
