case class Product(id: Int, name: String, price: Double)

class ProductController {
  val products = List(
    Product(1, "Bread", 5.00),
    Product(2, "Milk", 4.50),
    Product(3, "Eggs", 6.50)
  )

  def showAll(): Unit = {
    println("=== Products ===")
    products.foreach { p =>
      println(f"ID: ${p.id} | Name: ${p.name} | Price: ${p.price}%.2f PLN")
    }
  }
}

@main def start(): Unit = {
  val controler = new ProductController()
  controler.showAll()
}