'use strict';
let asyncForEach = require('./asyncForEach');
const axios = require('axios');
// const appRoutes = require('../routes.json');

module.exports = async function getAppRoutes() {
  const routes = ['/'];

  let cities = await get_cities();

  await asyncForEach(cities, async function (city) {
    // Генирация главного урла города
    routes.push('/'+city.alias);

    // Генирация урлов для тегов
    let categories = await get_tags(city.id);
    await asyncForEach(categories, async function (category) {
      // console.log(category);
      routes.push('/'+city.alias+'/restaurants/category/'+category.alias);
      // console.log(category);
    });


    // Генирация страниц для ресторанов
    let restaurants = await get_restaurants_city(city.id);

    await asyncForEach(restaurants, async function (restaurant) {
      let url = await get_rest_url(restaurant);
      routes.push('/'+city.alias+url);
    });


  });

  // Return all available routes
  return routes;
};


async function get_cities() {
  let zoneList = await axios.get('https://yestapi.xyz/get-zones');
  return zoneList.data
}

async function get_restaurants_city(city_id) {
  let sortByCoord = {
    zone_id: city_id,
    limit: 100000,
    start: 0,
  };
  let restaurantsList = await axios.post('https://yestapi.xyz/restaurants', sortByCoord);
  return restaurantsList.data.restaurants
}

async function get_tags(city_id) {
  // console.log(city_id);
  let categoriesList = await axios.post('https://yestapi.xyz/categories', {
    zone_id: city_id
  });
  // console.log(categoriesList.data);
  return categoriesList.data;
}

async function get_rest_url(info){
  let name = await translite(info.name);
  let modifName = name.replace(' ', '-');
  let url = `/restaurant/${info.restaurant_id}-${modifName.toLowerCase()}`;
  return url;
}

async function translite(str) {
  str = str.replace(/[^A-Za-zА-Яа-яЁё]^-/g, "");

  str = str.replace(/\n/, "");
  str = str.replace(/\r/, "");
  str = str.replace(/\s+/, " ");
  str = str.replace(/[^0-9a-z-_ ]/i, "");
  str = str.replace(/ /, "-");



  let ru = {
      'а': 'a',
      'б': 'b',
      'в': 'v',
      'г': 'g',
      'д': 'd',
      'е': 'e',
      'ё': 'e',
      'ж': 'j',
      'з': 'z',
      'и': 'i',
      'к': 'k',
      'л': 'l',
      'м': 'm',
      'н': 'n',
      'о': 'o',
      'п': 'p',
      'р': 'r',
      'с': 's',
      'т': 't',
      'у': 'u',
      'ф': 'f',
      'х': 'h',
      'ц': 'c',
      'ч': 'ch',
      'ш': 'sh',
      'щ': 'shch',
      'ы': 'y',
      'э': 'e',
      'ю': 'u',
      'я': 'ya',
      'ъ': '',
      'ь': ''
    },
    n_str = [];
  for (var i = 0; i < str.length; ++i) {
    n_str.push(
      ru[str[i]] ||
      ru[str[i].toLowerCase()] == undefined && str[i] ||
      ru[str[i].toLowerCase()].replace(/^(.)/, function (match) {
        return match.toUpperCase()
      })
    );
  }


  return n_str.join('');
}
