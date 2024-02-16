// Підключаємо технологію express для back-end сервера
const express = require('express')
const { info } = require('sass')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class Product {
  static #list = []

  constructor(name, price, description) {
    this.id = Math.trunc(Math.random() * 100000)
    this.createDate = new Date().toISOString()
    this.name = name
    this.price = price
    this.description = description
  }

  static add = (product) => {
     if (product) {
      this.#list.push(product)
      return true
    }
    return false
  }

  static getList = () => 
    this.#list
  
  static getById = (id) => 
    this.#list.find((product) => product.id === id)
  
  static updateById = (id, data) => {
    const product = this.getById(id);

    if (product) {
      this.update(product, data);


      return true;
    } else {
      return false;
    }
  }

  static update = (id, data) => {
    const product = this.getById(id)

    if (product) {
      if (data.name) {
        product.name = data.name
      }
      if(data.price){
        product.price = data.price
      }
      if (data.description) {
        product.description = data.description
      }
      return true
    }
    return false
  }
  static deleteById = (id) => {
    const index = this.#list.findIndex((product) => product.id === id,
    )
  }
}
// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/product-create', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-create',
    info: '',
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/product-create', function (req, res) {

  const { name, price, description } = req.body

  const product = new Product(name, price, description)

  Product.add(product)

  console.log(Product.getList())

  res.render('alert', {
    style: 'alert',
    info: 'Продукт успішно створено',
  })
  
})

router.get('/product-delete', function (req, res) {
 
  const { id } = req.query

  Product.deleteById(Name(id))

  res.render('alert', {
   
    style: 'alert',
    info: 'Продукт успішно видалено',
  })
 
})

router.post('/product-update', function (req, res) {
 
  const { name, price, description } = req.body
  
  let result = false

  const product = Product.getById(Product(id))

  res.render('alert', {
   
    style: 'alert',
    info: result ? 'Дані оновлено' : 'Виникла помилка',
  })
 
})

// ================================================================

router.get('/product-list', function (req, res) {
  const list = Product.getList()

  res.render('product-list', {
    style: 'product-list',

    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})

// ================================================================
router.get('/product-edit', function (req, res) {
  const { id } = req.query

  const product = Product.getById(Number(id))

  res.render('product-edit', {
    style: 'product-edit',
    name: product.name,
    price: product.price,
    description: product.description,
    ID: id,
  })
})

router.post('/product-edit', function (req, res) {
  const { name, price, id, description } = req.body

  Product.getById(id)

  const data = {
    name: name,
    price: price,
    description: description,
  }

  let result = false

  result = Product.updateById(Number(id), data)

  res.render('success-alert', {
    style: 'success-alert',
    href: '/product-list',
    title: 'Редагування товару',
    alert: result
      ? 'Дані товару успішно оновлено! '
      : 'Не вдалося оновити дані товару!',
  })
})

// ================================================================
router.get('/product-delete', function (req, res) {
  const { id } = req.query
  let result = false

  result = Product.deleteById(Number(id))

  res.render('success-alert', {
    style: 'success-alert',
    title: 'Видалення товару',
    alert: result
      ? 'Товар успішно видалено!'
      : `Не вдалося видалити товар! `,
  })
})
// Підключаємо роутер до бек-енду
module.exports = router
