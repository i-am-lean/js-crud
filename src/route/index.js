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

  static getById(id) {
    return (
      Track.#list.find((track) => (track.id = id)) || null
    )
  }
}

Track.create (
  'Інь Ян',
  'Monatic i Roxolana',
  'https://picsum.photos/100/100',
)

Track.create (
  'NK',
  'Я - Україна',
  'https://picsum.photos/100/100',
)

Track.create(
  'Baila Comigo (remix)',
  'Selena Gomes i Rauw Alwjandro',
  'https://picsum.photos/100/100',
)

Track.create (
  'Kozak Siromakha',
  'Гуляли',
  'https://picsum.photos/100/100',
)

Track.create (
  'Romax',
  'Батько наш Бандера',
  'https://picsum.photos/100/100',
)

Track.create (
  'Jerry Heil',
  'Три полоси',
  'https://picsum.photos/100/100',
)

Track.create (
  'Pianoboy',
  'Родина',
  'https://picsum.photos/100/100',
)

console.log(Track.getList())

class Playlist{
  //Статичне приватне поле для зберігання списка обʼєктів Playlist

  static #list = []

  constructor(name) {
    this.id = Math.floor(1000 + Math.random() * 9000) //Генеруємо випадкове id
    this.name = name
    this.tracks = [] 
    this.image = 'https://picsum.photos/100/100'
  }

   // Статичний метод для створення обʼєкту Playlist і додавання його до списку #list

   static create(name) {
    const newPlaylist = new Playlist(name)
    this.#list.push(newPlaylist)
    return newPlaylist
   }

    // Статичний метод для отримання всього списку плейлистів
   static getList() {
    return this.#list.reverse()
   }

   static makeMix(playlist) {
    const allTracks = Track.getList()

    let randomTracks = allTracks
      .sort(() => 0.5 - Math.random())
      .slice(0, 3) //Щоб залишилось 3 треки з рандомного списку треків

    playlist.tracks.push(...randomTracks) 
   }

   //По ідентифікатору знайти певний плейлист
   static getById(id) {
    return (
      Playlist.#list.find(
        (playlist) => (playlist.id === id),
      ) || null
    )
   }

   deleteTrackById(trackId) {
    this.tracks = this.tracks.filter(
      (track) => track.id !== trackId,
    )
   }

   addTrack(track) {
    this.tracks.push(track)
    return this.tracks
  }


  //пошук незалежний від табуляції
  static findListByValue(name) {
    return this.#list.filter((playlist) =>
      playlist.name
        .toLowerCase()
        .includes(name.toLowerCase()),
    )
  }
}

Playlist.makeMix(Playlist.create('Summer'))
Playlist.makeMix(Playlist.create('Winter'))
Playlist.makeMix(Playlist.create('Spring'))

// ↙️ тут вводимо шлях (PATH) до сторінки


router.get('/', function (req, res) {
  const list = Playlist.getList()
  console.log(list)

  res.render('spotify', {
    style: 'spotify',

    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
    },
  })
})

router.get('/spotify-choose', function (req, res) {
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

// ===================
router.get('/spotify-search', function (req, res) {
  const value = ''
  const list = Playlist.findListByValue(value)
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-search', {
    style: 'spotify-search',

    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})

router.post('/spotify-search', function (req, res) {
  const value = req.body.value || '' //динимічний пошук в цьому розділі

  console.log('value', value)
  
  const list = Playlist.findListByValue(value)

 
  // res.render генерує нам HTML сторінку
  res.render('spotify-search', {
     // ↙️ cюди вводимо назву файлу з сontainer
    style: 'spotify-search',

    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
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

  const playlist = Playlist.create(name)

  if (isMix) {
    Playlist.makeMix(playlist)
  }
  //Сворений плейлист
  console.log(playlist)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

//=================================

  router.get('/spotify-playlist', function (req,res) {
    const id = Number(req.query.id)

    const playlist = Playlist.getById(id)

    if(!playlist) {
      return res.render('alert', {
        style: 'alert',

        data: {
          message: 'Помилка',
          info: 'Такого плейлиста не знайдено',
          link: `/`,
        },
      })
    }

    res.render('spotify-playlist', {
      style: 'spotify-playlist',

      data: {
        playlistId: playlist.id,
        tracks: playlist.tracks,
        name: playlist.name,
      },
    })
  })

router.get('/spotify-track-delete', function (req, res){
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)
  const playlist = Playlist.getById(playlistId)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Плейлист не знайдено',
        link: '/spotify-playlist?id=${playlistId}',
      },
    })
  }

  playlist.deleteTrackById(trackId)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

// ================================================================

router.get('/spotify-playlist-add', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  
  const playlist = Playlist.getById(playlistId)
  const allTracks = Track.getList()
  console.log(playlistId, playlist, allTracks)
  res.render('spotify-playlist-add', {
    style: 'spotify-playlist-add',

    data: {
      playlistId: playlist.id,
      tracks: allTracks,
    },
  })
})


// ================================================================
router.post('/spotify-playlist-add', function (req, res) {
  const playlistId = Number(req.body.playlistId)
  const trackId = Number(req.body.trackId)
  console.log('/spotify-track-add', playlistId, trackId)
  const playlist = Playlist.getById(playlistId)


  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Плейлист не знайдено',
        link: `/spotify-playlist?id=${playlistId}`,
      },
    })
  }
  const trackToAdd = Track.getList().find(
    (track) => track.id === trackId,
  )
  if (!trackToAdd) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Такого треку не знайдено',
        link: `/spotify-playlist-add?playlistId=${playlistId}`,
      },
    })
  }
  playlist.tracks.push(trackToAdd)
  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
