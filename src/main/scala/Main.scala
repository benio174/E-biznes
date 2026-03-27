import scala.collection.mutable.ListBuffer

case class Product(id: Int, name: String, price: Double)
case class Category(id: Int, name: String)
case class CartItem(id: Int, productId: Int, quantity: Int)

class CategoryController {
  private val categories = ListBuffer(
    Category(1, "Electronics"),
    Category(2, "Groceries")
  )
  def getAll: List[Category] = categories.toList
  def getById(id: Int): Option[Category] = categories.find(_.id == id)
  def create(c: Category): Unit = categories += c
  def delete(id: Int): Unit = categories.filterInPlace(_.id != id)
  def updateName(id: Int, newName: String): Boolean = {
    val index = categories.indexWhere(_.id == id)
    if (index != -1) {
      val old = categories(index)
      categories.update(index, old.copy(name = newName))
      true
    } else false
  }
}

class CartController {
  private val cartItems = ListBuffer[CartItem]()

  def getCart: List[CartItem] = cartItems.toList
  def addToCart(item: CartItem): Unit = cartItems += item
  def removeFromCart(id: Int): Unit = cartItems.filterInPlace(_.id != id)
  def getById(id: Int): Option[CartItem] = cartItems.find(_.id == id)
  def updateQuantity(id: Int, newQty: Int): Boolean = {
    val index = cartItems.indexWhere(_.id == id)
    if (index != -1) {
      val old = cartItems(index)
      cartItems.update(index, old.copy(quantity = newQty))
      true
    } else false
  }
}

class ProductController {
  private val products: ListBuffer[Product] = ListBuffer(
    Product(1, "Bread", 5.00),
    Product(2, "Milk", 4.50),
    Product(3, "Eggs", 6.50)
  )
  def getAll: List[Product] = products.toList
  def getById(id: Int): Option[Product] = products.find(_.id == id)
  def create(p: Product): Unit = {
    products += p
    println(s"Product added: ${p.name}")
  }
  def updatePrice(id: Int, newPrice: Double): Boolean = {
    val index = products.indexWhere(_.id == id)
    if (index != -1) {
      val oldProduct = products(index)
      products.update(index, oldProduct.copy(price = newPrice))
      true
    } else false
  }
  def delete(id: Int): Boolean = {
    val before = products.size
    products --= products.filter(_.id == id)
    products.size < before
  }
}

@main def start(): Unit = {
  val controler = new ProductController()
  val catCtrl  = new CategoryController()
  val cartCtrl = new CartController()
  println("--- READ ---")
  controler.getAll.foreach(p => println(f"ID: ${p.id} | ${p.name}%-10s | ${p.price}%.2f"))

  println("\n--- CREATE ---")
  controler.create(Product(4, "Cheese", 12.00))

  println("\n--- UPDATE ---")
  if(controler.updatePrice(2, 4.99)) println("Price updated.")

  println("\n--- DELETE ---")
  if(controler.delete(1)) println("Product deleted.")

  println("\n--- FINAL ---")
  controler.getAll.foreach(p => println(f"ID: ${p.id} | ${p.name}%-10s | ${p.price}%.2f"))

  println("\n=== CATEGORIES ===")
  catCtrl.create(Category(3, "Books"))
  println(s"All categories: ${catCtrl.getAll.map(_.name).mkString(", ")}")
  println(s"Category with ID 3: ${catCtrl.getById(3).map(_.name).getOrElse("Brak")}")
  catCtrl.updateName(1, "Drinks")
  println(s"Changed category 1: ${catCtrl.getById(1).get.name}")
  catCtrl.delete(2)
  println(s"Categories after deleted ID 2: ${catCtrl.getAll.map(_.name).mkString(", ")}")


  println("\n=== CART ===")
  cartCtrl.addToCart(CartItem(1, productId = 4, quantity = 2))
  cartCtrl.addToCart(CartItem(2, productId = 3, quantity = 10))
  println(s"Number of items in cart: ${cartCtrl.getCart.size}")
  println(s"Cart item ID 1: ProductID=${cartCtrl.getById(1).get.productId}")
  cartCtrl.updateQuantity(1, 5)
  println(s"New quantity for item 1: ${cartCtrl.getById(1).get.quantity}")
  cartCtrl.removeFromCart(2)
  println(s"Cart items after removal: ${cartCtrl.getCart.map(_.id).mkString(", ")}")
}