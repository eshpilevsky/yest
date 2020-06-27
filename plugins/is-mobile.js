const isMobile = () => {
    if (!navigator || !screen) {
        return false
    }
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 451 || screen.width < 1024) {
        return true
    }
    return false
}

export default (context, inject) => {
    const { app, store } = context
    app.mounted = () => {
        if (isMobile()) {
            store.commit('device/SET_IS_MOBILE')
        } else {
            store.commit('device/UNSET_IS_MOBILE')
        }
    }
}