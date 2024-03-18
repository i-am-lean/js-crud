// Підключаємо технологію express для back-end сервера
const express = require('express')

// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Track {
  //Статичне приватне поле для зберігання списку обʼєктів Track
  static #list = []

  constructor(name, author, image) {
    this.id = Math.floor(1000 + Math.random() * 9000) //Генеруємо випадкове id
    this.name = name
    this.author = author
    this.image = image
  }

  // Статичний метод для створення обʼєкту Track і додавання його до списку #list

  static create(name, author, image) {
    const newTrack = new Track(name, author, image)
    this.#list.push(newTrack)
    return newTrack
  }

  // Статичний метод для отримання всього списку треків

  static getList () {
    return this.#list.reverse()
  }
}

Track.create (
  'Інь Ян',
  'Monatic i Roxolana',
  'https://picsum.photos/seed/picsum/100/100',
)

Track.create (
  'NK',
  'Я - Україна',
  'https://picsum.photos/seed/picsum/100/100',
)

Track.create (
  'Kozak Siromakha',
  'Гуляли',
  'https://picsum.photos/seed/picsum/100/100',
)

Track.create (
  'Kozak Siromakha',
  'Гуляли',
  'https://picsum.photos/seed/picsum/100/100',
)


// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінк
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-choose', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-choose',//папка, в якій знаходиться верстка сторінки

    // значення змінних в картках 
    data: {},

  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================
router.get('/spotify-create', function (req, res) {
  // res.render генерує нам HTML сторінк
  // ↙️ cюди вводимо назву файлу з сontainer

  //Якщо є isMix
  const isMix = !!req.query.isMix
   //то виводимо isMix в консоль
  console.log(isMix)

  res.render('spotify-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-create',//папка, в якій знаходиться верстка сторінки

    // значення змінних в картках 
    data: {
      isMix,

    },

  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================
router.post('/spotify-create', function (req, res) {

  const isMix = !!req.query.isMix
  //Назва плейлиста
  const name = req.body.name

  if(!name) {
    return res.render('alert', {
        // вказуємо назву папки контейнера, в якій знаходяться наші стилі
        style: 'alert',//папка, в якій знаходиться верстка сторінки

        // значення змінних в картках 
        data: {
          message: 'Помилка',
          info: 'Введіть назву плейлиста',
          link: isMix ? '/spotify-create?isMix=true' : '/spotify-create',
        },
      })
  }
  //Сворений плейлист

  res.render('spotify-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-create',//папка, в якій знаходиться верстка сторінки

    // значення змінних в картках 
    data: {
    },
  })
})

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
