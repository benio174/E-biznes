import scala.collection.mutable.ListBuffer

case class Product(id: Int, name: String, price: Double)

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
}