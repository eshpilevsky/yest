'use strict';
let asyncForEach = require('./asyncForEach');
const axios = require('axios');
// const appRoutes = require('../routes.json');

module.exports = async function getAppRoutes() {
  let text_pages_priority = 0.6;
  const routes = [
    {
      url:'/',
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    {
      url:'/contacts',
      changefreq: 'daily',
      priority: text_pages_priority,
      lastmod: new Date()
    },
    {
      url:'/delivery',
      changefreq: 'daily',
      priority: text_pages_priority,
      lastmod: new Date()
    },
    {
      url:'/terms-of-use',
      changefreq: 'daily',
      priority: text_pages_priority,
      lastmod: new Date()
    },
    {
      url:'/faq',
      changefreq: 'daily',
      priority: text_pages_priority,
      lastmod: new Date()
    },
    {
      url:'/questions',
      changefreq: 'daily',
      priority: text_pages_priority,
      lastmod: new Date()
    },
    {
      url:'/partner',
      changefreq: 'daily',
      priority: text_pages_priority,
      lastmod: new Date()
    },
    {
      url:'/rabota',
      changefreq: 'daily',
      priority: text_pages_priority,
      lastmod: new Date()
    },
    {
      url:'/business',
      changefreq: 'daily',
      priority: text_pages_priority,
      lastmod: new Date()
    },

  //  cart
  //  checkout

  ];

  let cities = await get_cities();

  await asyncForEach(cities, async function (city) {
    // Генирация главного урла города
    routes.push({
      url:'/'+city.alias,
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    });

    // Генирация урлов для тегов
    let categories = await get_tags(city.id);
    await asyncForEach(categories, async function (category) {
      // console.log(category);
      routes.push({
          url:'/'+city.alias+'/restaurants/category/'+category.alias,
          changefreq: 'daily',
          priority: 0.9,
          lastmod: new Date()
        });
      // console.log(category);
    });


    // Генирация страниц для ресторанов
    let restaurants = await get_restaurants_city(city.id);

    await asyncForEach(restaurants, async function (restaurant) {
      let url = await get_rest_url(restaurant);
      routes.push({
        url:'/'+city.alias+url,
        changefreq: 'daily',
        priority: 0.8,
        lastmod: new Date()
      });
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
async function translite(str){
  let text = await to_latin(str);
  return text.toLowerCase();
}

async function to_latin(str) {
  str = str.replace(/\n/, "");
  str = str.replace(/\r/, "");
  str = str.replace(/\s+/, " ");
//   str = str.replace(/[^0-9a-z-_ ]/i, "");

  const ru = new Map([
    ['а', 'a'], ['б', 'b'], ['в', 'v'], ['г', 'g'], ['д', 'd'], ['е', 'e'],
    ['є', 'e'], ['ё', 'e'], ['ж', 'j'], ['з', 'z'], ['и', 'i'], ['ї', 'yi'], ['й', 'i'],
    ['к', 'k'], ['л', 'l'], ['м', 'm'], ['н', 'n'], ['о', 'o'], ['п', 'p'], ['р', 'r'],
    ['с', 's'], ['т', 't'], ['у', 'u'], ['ф', 'f'], ['х', 'h'], ['ц', 'c'], ['ч', 'ch'],
    ['ш', 'sh'], ['щ', 'shch'], ['ы', 'y'], ['э', 'e'], ['ю', 'u'], ['я', 'ya'],
  ]);

  str = str.replace(/[ъь]+/g, '');

  return Array.from(str)
    .reduce((s, l) =>
      s + (
        ru.get(l)
        || ru.get(l.toLowerCase()) === undefined && l
        || ru.get(l.toLowerCase()).toUpperCase()
      )
      , '');

}

