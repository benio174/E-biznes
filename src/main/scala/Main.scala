import scala.collection.mutable.ListBuffer
import akka.actor.typed.ActorSystem
import akka.actor.typed.scaladsl.Behaviors
import scala.concurrent.ExecutionContext

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

object Main extends App {
  implicit val system: ActorSystem[Nothing] = ActorSystem(Behaviors.empty, "EcommerceSystem")
  implicit val executionContext: ExecutionContext = system.executionContext

  val productCtrl = new ProductController()
  val categoryCtrl = new CategoryController()
  val cartCtrl = new CartController()
  val server = new Server(productCtrl, categoryCtrl, cartCtrl)
  server.start()
}