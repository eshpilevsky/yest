import * as Cookie from 'js-cookie'

const state = () => ({
  data: {
    name: null,
    selectedCategory: {
      id: null,
	  alias: null,
	  name: null,
    },
    searchNameKitchenDish: null,
    categoryList: {},
    userNumber: null,
    smsTimer: 0,
  },
  status: 0
})

const actions = {

  caclWorkTime(context, payload) {
    return new Promise((resolve, reject) => {
		const openRestorants = [];
		const closeRestorants = [];
		const currentDay = new Date().getDay();
		const currentTime = new Date().getTime();
        console.log('caclWorkTime -> payload', payload)
		payload.forEach((item, i, arr) => {
			// const op = item.operation_time;
			const op = item.time;
			const buffer = [];
			if (item.time.length > 6) {
				op.forEach((optime, index, operationTimeArr) => {
					if (optime.day === currentDay) {
						buffer.push(optime);
					}
				});
				let closeTime = buffer[0].close_time
				const openTime =
					buffer.length > 1 ? buffer[1].open_time : buffer[0].open_time;

				const closeTimeHour = closeTime.slice(0, 2);
				const closeTimeMin = closeTime.slice(3, 5);
				const closeTimeSec = closeTime.slice(6, 8);
				const closeTimeTimestamp = new Date();
				closeTimeTimestamp.setHours(closeTimeHour);
				closeTimeTimestamp.setMinutes(closeTimeMin);
				closeTimeTimestamp.setSeconds(closeTimeSec);

				const openTimeHour = openTime.slice(0, 2);
				const openTimeMin = openTime.slice(3, 5);
				const openTimeSec = openTime.slice(6, 8);
				const openTimeTimestamp = new Date();

				openTimeTimestamp.setHours(openTimeHour);
				openTimeTimestamp.setMinutes(openTimeMin);
				openTimeTimestamp.setSeconds(openTimeSec);

				item.today_close_time = closeTimeTimestamp.getTime();
				item.today_open_time = openTimeTimestamp.getTime();

				if (buffer.length !== 1) {
					item.today_close_time += 86400000;
				}

				if (currentTime < item.today_close_time) {
					openRestorants.push(item);
					item.is_open = true;
				} else {
					closeRestorants.push(item);
					item.is_open = false;
				}
			}
		});
		resolve(openRestorants.concat(closeRestorants))
    });
  },
  checkUserPhonemuber(context) {
    return new Promise((resolve, reject) => {
      resolve(context.state.data.userNumber)
    });
  },
  setSmsTimer(context, time) {
    context.commit('SET_SMS_TIMER', time)
  },

  setUserPhoneNumber(context, payload) {
    context.commit('SET_USER_PHONE_NUMBER', payload)
  },

  selectCategory(context, payload) {
    context.commit('SELECT_CATEGORY', payload)
  },

  setSearchNameKitchenDish(context, payload) {
    context.commit('SEARCH_NAME_KITCHEN_DISH', payload)
  },

  allCategory(context, payload) {
    context.commit('CATEGOTY_LIST', payload)
  },

};

const mutations = {
  SET_SMS_TIMER(state, time) {
    state.status = '200'
    state.data.smsTimer = time
  },

  SET_USER_PHONE_NUMBER(state, payload) {
	state.status = '200'
	Cookie.set('phone', payload)
    state.data.userNumber = payload
  },

  SELECT_CATEGORY(state, payload) {
    state.status = '200'
    state.data.selectedCategory = payload
  },

  CATEGOTY_LIST(state, payload) {
    state.status = '200'
    state.data.categoryList = payload
  },

  SEARCH_NAME_KITCHEN_DISH(state, payload) {
    state.status = '200'
    state.data.searchNameKitchenDish = payload
  },

};

const getters = {
  getSmsTimer(state) {
    return state.data.smsTimer
  },
  getSelectedCategory(state) {
    return state.data.selectedCategory
  },
  getCategoryList(state) {
    return state.data.categoryList
  },
  getSearchNameKitchenDish(state) {
    return state.data.searchNameKitchenDish
  },
  getSelectedCategoryName(state) {
    const catList = state.data.categoryList
    const selectCategoryId = state.data.selectedCategory.id
    let test = ''
    for (let index = 0; index < catList.length; index++) {
      if (catList[index].id === selectCategoryId) {
        test = catList.name
      }
    }
    return test
  },
  getUserPhoneNumber(state) {
    return state.data.userNumber
  }
};

// export const strict = false

export default {
  state,
  actions,
  mutations,
  getters,
}
