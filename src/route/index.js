// Підключаємо технологію express для back-end сервера
const express = require('express')

// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class Product {
  static #list = []
  static #count = 0 //для створення унікального id з врахуванням видалення та додавання товарів

  //оголошуємо кожну змінну
  constructor(img, title, description, category, price, amount = 0,) {
  this.id = ++Product.#count //Генерує унікальний id
    this.img = img
    this.title = title
    this.description = description
    this.category = category
    this.price = price

    this.amount = amount
  }

  //додає новий товар
  static add = (...data) => {
    const newProduct = new Product(...data)

    this.#list.push(newProduct)
  }

  //Статичний список товару
  static getList = () => {
    return this.#list
  }
  //Знаходить продукт по id
  static getById = (id) => {
    return this.#list.find((product) => product.id === id)
  }

  static getRandomList = (id) => {//прибирає товар з вказаним id

    //Фільтруємо товари, щоб вилучити той, з яким порівнюємо id
    const filteredList = this.#list.filter((product) => product.id !== id,)

    //Відсортуємо за допомогою Math.random() та перемішаємо масив
    const shuffledList = filteredList.sort(() => Math.random() - 0.5,)

    //Повертаємо перші 3 елементи з перемішаного масиву
    return shuffledList.splice(0, 3)
  }

}

//створюємо інші товари
Product.add (
  'https://picsum.photos/seed/picsum/200/300/',
   "Комп'ютер COBRA Advanced(I11F.8.H1S2.15T.13356) Intel" ,
    'Intel Core i3-10100F (3.6 - 4.3 ГГц) / RAM 8 ГБ / HDD 1 ТБ + SSD 240 ГБ / GeForce GTX 1050 Ti, 4 ГБ / без ОД / LAN / Linux',
  [
    { id: 2, text: 'Топ продажів' }, 
  ],
  17000,
  10,
)

Product.add (
  'https://picsum.photos/200/300?grayscale',
   "Комп'ютер ARTLINE Gaming by ASUS TUF v119 (TUFv119)" ,
    'Intel Core i9-13900KF (3.0 - 5.8 ГГц) / RAM 64 ГБ / SSD 2 ТБ (2 x 1 ТБ) / nVidia GeForce RTX 4070 Ti, 12 ГБ / без ОД / LAN / Wi-Fi / Bluetooth / без ОС',
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' }, 
  ],
  117050, // Вартість 1 одиниці (price)
  10,// Кількість одиниць в наявності (amount)
)

Product.add (
  'https://picsum.photos/200/300/?blur',
   "Комп'ютер Artline Gaming (X43v31) AMD Ryzen 5 3600/" ,
    'AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС',
  [
    { id: 2, text: 'Топ продажів' }, 
  ],
  11050,
  10,
)

// Вартість доставки
class Purchase {
  static DELIVERY_PRICE = 150
  static #BONUS_FACTOR = 0.1

  static #count = 0
  static #list = []

  static #bonusAccount = new Map()

  static getBonusBalance = (email) => {
    return Purchase.#bonusAccount.get(email) || 0
  }

  static calcBonusAmount = (value) => {
    return value * Purchase.#BONUS_FACTOR
  }

  //кешбек
  static updateBonusBalance = (
    email,
    price,
    bonusUse = 0,
  ) => {
    const amount = this.calcBonusAmount(price)

    const currentBalance = Purchase.getBonusBalance(email)
//вираховуємо нову сумму замовлення після застосування списання кешбеку
    const updateBalance = currentBalance + amount - bonusUse

    Purchase.#bonusAccount.set(email, updateBalance)

    console.log(email, updateBalance)
//повертаємо кількість нарахованих бонусів
    return amount
  }
  
  constructor(data, product) {
    this.id = ++Purchase.#count

    this.firstname = data.firstname
    this.lastname = data.lastname

    this.phone = data.phone
    this.email = data.email

    this.comment = data.comment || null

    this.bonus = data.bonus || 0

    this.promocode = data.promocode || null

    this.totalPrice = data.totalPrice
    this.productPrice = data.productPrice
    this.deliveryPrice = data.deliveryPrice
    this.amount = data.amount

    this.product = product
  }
  //приймає аргумент
  static add = (...arg) => {
    
    const newPurchase = new Purchase(...arg)
  //кладе в список
    this.#list.push(newPurchase)
    //повертає створене замовлення 
    return newPurchase
  }
//повертає список від новішого замовлення до старіших та по потрібним стовпчикам(в необхідному порядку відображення інформації)
  static getList = () => {
    return Purchase.#list.reverse() 
  }
//знаходить замовлення та повертає по ідентифікатору
  static getById = (id) => {
    return this.#list.find((purchase) => purchase.id === id)
  }

  static updateById = (id, data) => {
    const purchase = Purchase.getById(id)
    //передаємо змінні та приймаємо їх
    if (purchase) {
      if (data.firstname)
        purchase.firstname = data.firstname
      if (data.lastname)
        purchase.lastname = data.lastname
      if (data.phone)
        purchase.phone = data.phone
      if (data.email)
        purchase.email = data.email

      return true
    } else {
       //данні не оновились
      return false
    }
  }
}
//Додаємо декілька покупців для збереження покупки

Purchase.add(
  {
    firstname: 'Eleonora',
    lastname: 'Swift',
    phone: '1234567890',
    email: 'eleonora@example.com',
    totalPrice: 2500,
    productPrice: 400,
    deliveryPrice: 100,
    amount: 2,
  },
  Product.getById(1),
)

Purchase.add(
  {
    firstname: 'Donald',
    lastname: 'Svit',
    phone: '1234567890',
    email: 'donald@example.com',
    totalPrice: 1500,
    productPrice: 400,
    deliveryPrice: 100,
    amount: 2,
  },
  Product.getById(2),
)

console.log(Purchase.getList())

class Promocode {
  static #list = []

  constructor(name, factor) {
    this.name = name
    this.factor = factor
  }
// name= назва промокоду factor=знижка
  static add = (name, factor) => {
    const newPromocode =  new Promocode(name, factor)
    Promocode.#list.push(newPromocode)
    return newPromocode
  }
// шукає промокод по назві
  static getByName = (name) => {
    return this.#list.find((promo) => promo.name === name)
  }
  // вираховуємо назву знижки
  static calc = (promo, price) => {
    return price * promo.factor
  }
}
//тестові промокоди
Promocode.add('WINTER2024', 0.9)
Promocode.add('DISCOUNT50', 0.5)
Promocode.add('SALES25', 0.75)
// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінк
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-index',//папка, в якій знаходиться верстка сторінки

    // значення змінних в картках 
    data: {
      list: Product.getList(),
    },

  })
  // ↑↑ сюди вводимо JSON дані
})

router.get('/', function (req, res) {
  res.render('alert', {
    style: 'alert',

    data: {
      message: 'Операція успішна',
      info: 'Товар створений',
      link: '/test-path',
    },
  })

})
 
//створюємо логіку картки
router.get('/purchase-product', function (req, res) {
  //знаходимо число від req.query.id, Number тому що по замовченню виводить рядок
  const id = Number(req.query.id)
  // res.render генерує нам HTML сторінк
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-product', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-product',//папка, в якій знаходиться верстка сторінки

    // значення змінних в картках 
    data: {
      list: Product.getRandomList(id), //отримати дані продукта з заданого списку
      product: Product.getById(id), //дані продукта, що треба отримати
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

//створення замовлення
router.post('/purchase-create', function (req, res) {
  // витягнули id, amount
  const id = Number(req.query.id)
  const amount = Number(req.body.amount)

  //перевірка, щоб кількіть товару було додатним числом, якщо відʼємне - видає помилку з лінком щоб повернути назад
  if (amount < 1) {
    // ↙️ cюди вводимо назву файлу з сontainer
    return res.render('alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Некоректна кількість товару',
        link: '/purchase-product?id=${id}', //повертає на сторінку
      },
    })
  }

   // Пошук товару та виведення його
  const product = Product.getById(id)

  if (product.amount < 1) {
    // ↙️ cюди вводимо назву файлу з сontainer
    return res.render('alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Такої кількості товару немає в наявності',
        link: '/purchase-product?id=${id}', //повертає на сторінку
      },
    })
  }
   
  //виводимо витягнуті данні, щоб відслідковувати потік данних
  console.log(product, amount)

  const productPrice = product.price * amount 
  const totalPrice = productPrice + Purchase.DELIVERY_PRICE
  const bonus = Purchase.calcBonusAmount(totalPrice)
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-create',

    data: {
      id: product.id,
      cart: [
         {
          text: `${product.title} (${amount} шт)`,
          price: productPrice,
        },
        {
          text: `Доставка`,
          price: Purchase.DELIVERY_PRICE,
        },
      ],
      totalPrice,
      productPrice,
      deliveryPrice: Purchase.DELIVERY_PRICE,
      amount,
      bonus,
    },
  })

})

// ================================================================
//оформлення замовлення 
router.post('/purchase-submit', function (req, res) {

  const id = Number(req.query.id)

  let {
    totalPrice,
    productPrice,
    deliveryPrice,
    amount,

    firstname,
    lastname,
    email,
    phone,
    comment,

    promocode,
    bonus,
  } = req.body
  //пошук товару
  const product = Product.getById(id)
  //якщо товару немає
  if (!product) {
    return res.render('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Товар не знайдено',
        link: '/purchase-list',
      },
    })

  }
  
  if (product.amount < amount) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Товару нема в потрібній кількості',
        link: '/purchase-list',
      },
    })
  }
  //виконуємо конвертацію, щоб все було Number
  totalPrice = Number(totalPrice)
  productPrice = Number(productPrice)
  deliveryPrice = Number(deliveryPrice)
  amount = Number(amount)
  bonus = Number(bonus)

  if (
    //перевіряємо чи всі дані коректні
    isNaN(totalPrice) ||
    isNaN(productPrice) ||
    isNaN(deliveryPrice) ||
    isNaN(amount) ||
    isNaN(bonus)
  ) {
    //якщо якісь данні введено некоректно
    return res.render ('alert', {
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Некоректні дані',
        link: '/purchase-list',
      },
    })
  }
//якщо якесь поле не заповнене
  if (!firstname || !lastname || !email || !phone) {
     return res.render ('alert', {
      style: 'alert',

      data: {
        message: 'Заповніть обовʼязкові поля',
        info: 'Некоректні дані',
        link: '/purchase-list',
      },
    })
  }

  if (bonus || bonus > 0) {
    const bonusAmount = Purchase.getBonusBalance(email)
    console.log(bonusAmount)
    if (bonus > bonusAmount) {
      bonus = bonusAmount
    }

    Purchase.updateBonusBalance(email, totalPrice, bonus)

    totalPrice -= bonus
  } else {
    Purchase.updateBonusBalance(email, totalPrice, 0)
  }
  // перевіряяємо чи застосовується промокод
  if (promocode) {
    //результат виконання пошуку по назві промокоду
    promocode = Promocode.getByName(promocode)
    //якщо є такий промокод вираховує вартість заданого товару
    if (promocode) {
      totalPrice = Promocode.calc(promocode, totalPrice)
    }
  }

  if (totalPrice < 0) totalPrice = 0
//створюємо нове замовлення 
  const purchase = Purchase.add(
    {
      //обʼєкт з первними данними
      totalPrice,
      productPrice,
      deliveryPrice,
      amount,
      bonus,

      firstname,
      lastname,
      email,
      phone,

      promocode,
      comment,
    },
    //сам обʼєкт
    product,
  )
  //виводимо інформацію про продукт
  console.log(purchase)

  res.render ('alert', {
      style: 'alert',

      data: {
        message: 'Успішно',
        info: 'Замовлення створено',
        link: '/purchase-list',
      },
    })
  
})


// ================================================================
router.get('/purchase-list', function (req, res) {
  const orderList = Purchase.getList().map((purchase) => {
    return {
      id: purchase.id,
      productTitle: purchase.product.title,
      totalPrice: purchase.totalPrice,
      bonus: purchase.bonus,
    }
  })

  res.render('purchase-list', {
  style: 'purchase-list',
    data: {
      list: orderList,
    },
  })

})
// ================================================================

router.get('/purchase-update', function (req, res) {
  const id = Number(req.query.id)
  const purchaseItem = Purchase.getById(id)
  console.log(
    'purchaseItem from get',
    purchaseItem,
    purchaseItem.firstname,
  )

    res.render('purchase-update', {
    style: 'purchase-update',

    data: {
      id: purchaseItem.id,
      firstname: purchaseItem.firstname,
      lastname: purchaseItem.lastname,
      email: purchaseItem.email,
      phone: purchaseItem.phone,
    },
  })

  let { firstname, lastname, email, phone } = req.body

  router.post('/purchase-update', function (req, res) {
    const id = Number(req.query.id)
    const purchaseItem = Purchase.getById(id)
    console.log(
      'purchaseItem from POST',
      purchaseItem,
      purchaseItem.id,
    )

    if (!purchaseItem) {
      return res.render('alert', {
        style: 'alert',
        data: {
          message: 'Помилка',
          info: 'Замовлення не знайдено',
          link: '/purchase-list',
        },
      })
    }

    res.render('purchase-update', {
      style: 'purchase-update',

      data: {
        id,
        firstname: purchaseItem.firstname,
        lastname: purchaseItem.lastname,
        email: purchaseItem.email,
        phone: purchaseItem.phone,
      },
    })
  })

  router.post('/purchase-update-submit', function (req, res) {
    const id = Number(req.query.id)

    let { firstname, lastname, phone, email } = req.body

    if (!firstname || !lastname || !email || !phone) {
      return res.render('alert', {
        style: 'alert', 
        data: {
          message: 'Заповніть обовʼязкові поля',
          info: 'Некоректні дані',
          link: '/purchase-list',
        },
      })
    } else {
      Purchase.updateById(id, {
        firstname,
        lastname,
        phone,
        email,
      })
    }

    res.render('alert', {
      style: 'alert',

      data: {
        message: 'Успішно',
        info: 'Дані оновлено',
        link: '/purchase-list',
      },
    })

  })
})


// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
