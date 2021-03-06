import * as Cookie from 'js-cookie'
import ApiService from '~/common/api.service'

const state = () => ({
  data: {
    name: null,
    selectedCategoryInfoData: null,
    selectedCategory: {
      id: null,
      alias: null,
      name: null,
    },
    searchNameKitchenDish: null,
    searchText: null,
    searchResults: null,
    categoryList: {},
    userNumber: null,
    smsTimer: 0,
  },
  status: 0
})

const actions = {
  async caclWorkTime_forRestaurant(context, payload) {
    return new Promise((resolve, reject) => {
      const openRestaurants = [];
      const closeRestaurants = [];
      const currentDay = new Date().getDay();
      let UTC_DATE_TIME = new Date();
      // UTC_DATE_TIME.setMilliseconds(3 * 60 * 60 * 1000);
      let currentTime = ((UTC_DATE_TIME.getHours() * 3600) + (UTC_DATE_TIME.getMinutes() * 60) + (UTC_DATE_TIME.getSeconds()))*100;



      // const  = new Date().getTime();
      let item = payload;

        let todayOT = [];
        item.is_open = false;
        (item.operation_time).forEach((time, i_time, arr_time) => {
          if(time.day === currentDay){

            let time_open = (time.open_time).split(':');
            let close_time = (time.close_time).split(':');

            todayOT.push({
              time_open: (time_open[0]*3600) + (time_open[1]*60) + time_open[2],
              close_time: (close_time[0]*3600) + (close_time[1]*60) + close_time[2],
            });
          }
        });

        todayOT.forEach((time, i, arr) => {
          if(item.is_open === false){

            if(Number(time.time_open) <= currentTime && Number(time.close_time) > currentTime){
              item.is_open = true;
            }
          }
        });

        let returnData = {
          todayOT: todayOT,
          is_open: item.is_open
        };


      resolve(returnData);
    });
  },
  // Фильтрация ресторанов по режиму работы
  async caclWorkTime(context, payload) {
    return new Promise((resolve, reject) => {
		const openRestaurants = [];
		const closeRestaurants = [];
		const currentDay = new Date().getDay();
		let UTC_DATE_TIME = new Date();
		// UTC_DATE_TIME.setMilliseconds(3 * 60 * 60 * 1000);
    let currentTime = ((UTC_DATE_TIME.getHours() * 3600) + (UTC_DATE_TIME.getMinutes() * 60) + (UTC_DATE_TIME.getSeconds()))*100;



      // const  = new Date().getTime();
		let todayOT = [];
		payload.forEach((item, i, arr) => {
      todayOT = [];
      item.is_open = false;
      (item.operation_time).forEach((time, i_time, arr_time) => {
        if(time.day === currentDay){
          let time_open = (time.open_time).split(':');
          let close_time = (time.close_time).split(':');

          todayOT.push({
            time_open: (time_open[0]*3600) + (time_open[1]*60) + time_open[2],
            close_time: (close_time[0]*3600) + (close_time[1]*60) + close_time[2],
          });
        }
      });

      todayOT.forEach((time, i, arr) => {
        if(item.is_open === false){

          if(Number(time.time_open) <= currentTime && Number(time.close_time) > currentTime){
            item.is_open = true;
          }
        }
      });

      switch(item.is_open){
        case true:
          openRestaurants.push(item);
          break;
        case false:
          closeRestaurants.push(item);
          break;
      }
    });
		resolve(openRestaurants.concat(closeRestaurants))
    });
  },
  async calcWorkTime_onlyOpen(context, payload) {
    return new Promise((resolve, reject) => {
      const openRestaurants = [];
      const closeRestaurants = [];
      const currentDay = new Date().getDay();
      let UTC_DATE_TIME = new Date();
      // UTC_DATE_TIME.setMilliseconds(3 * 60 * 60 * 1000);
      let currentTime = ((UTC_DATE_TIME.getHours() * 3600) + (UTC_DATE_TIME.getMinutes() * 60) + (UTC_DATE_TIME.getSeconds()))*100;



      // const  = new Date().getTime();
      let todayOT = [];
      payload.forEach((item, i, arr) => {
        todayOT = [];
        item.is_open = false;
        (item.operation_time).forEach((time, i_time, arr_time) => {
          if(time.day === currentDay){
            let time_open = (time.open_time).split(':');
            let close_time = (time.close_time).split(':');

            todayOT.push({
              time_open: (time_open[0]*3600) + (time_open[1]*60) + time_open[2],
              close_time: (close_time[0]*3600) + (close_time[1]*60) + close_time[2],
            });
          }
        });

        todayOT.forEach((time, i, arr) => {
          if(item.is_open === false){

            if(Number(time.time_open) <= currentTime && Number(time.close_time) > currentTime){
              item.is_open = true;
            }
          }
        });

        switch(item.is_open){
          case true:
            openRestaurants.push(item);
            break;
          case false:
            closeRestaurants.push(item);
            break;
        }
      });
      resolve(openRestaurants)
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
  async setActiveCategoryInfoData(context, payload) {
    context.commit('SELECT_ACTIVE_CATEGORY_INFO_DATA', payload)
  },
  async selectCategory(context, payload) {
    context.commit('SELECT_CATEGORY', payload)
  },
  setSearchNameKitchenDish(context, payload) {
    context.commit('SEARCH_NAME_KITCHEN_DISH', payload)
  },
  allCategory(context, payload) {
    context.commit('CATEGOTY_LIST', payload)
  },
  async SearchSuggestions(context, payload){
    context.commit('SET_SEARCH_TEXT', payload.address);
    // Получение данных под SET_SEARCH_RESULTS //
    let data_to_send = {
      city: payload.city,
      searchText: payload.address
    };

    console.log(data_to_send);

    await ApiService.post('/check_delivery_address', data_to_send).then((res)=>{
      console.log('checkDeliveryAddress -> res', res)
    }).catch((err)=>{
      console.error(err);
    });

    // Получение данных под SET_SEARCH_RESULTS //
    context.commit('SET_SEARCH_RESULTS', [1,2,3,4,5,6,7,8,9,10]);
  }
};

const mutations = {
  SET_SEARCH_TEXT(state, text){
    state.status = 200;
    state.data.searchText = text
  },
  SET_SEARCH_RESULTS(state, data){
    state.status = 200;
    state.data.searchResults = data
  },
  SET_SMS_TIMER(state, time) {
    state.status = '200'
    state.data.smsTimer = time
  },

  SET_USER_PHONE_NUMBER(state, payload) {
	state.status = '200'
	Cookie.set('phone', payload);
    state.data.userNumber = payload
  },

  SELECT_CATEGORY(state, payload) {
    state.status = '200'
    state.data.selectedCategory = payload
  },
  SELECT_ACTIVE_CATEGORY_INFO_DATA(state, payload) {
    state.status = '200';
    state.data.selectedCategoryInfoData = payload
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
  getActiveCategoryInfoData(state){
    return state.data.selectedCategoryInfoData;
  },
  getSearchResults(state){
    return state.data.searchResults;
  },
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
