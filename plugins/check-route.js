export default function({ route, from, store, redirect }) {
	if (!process.server) {
		console.log('redirect', redirect)
		console.log('store', store)
		console.log('from', from)
		console.log('route', route)
	}
	
}
