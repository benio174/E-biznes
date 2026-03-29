import akka.actor.typed.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.model.HttpMethods._
import akka.http.scaladsl.server.Directives._
import ch.megard.akka.http.cors.scaladsl.CorsDirectives._
import ch.megard.akka.http.cors.scaladsl.settings.CorsSettings
import ch.megard.akka.http.cors.scaladsl.model.HttpOriginMatcher
import scala.concurrent.Await
import scala.concurrent.duration.Duration
import scala.concurrent.ExecutionContext

class Server(
  productCtrl: ProductController, 
  categoryCtrl: CategoryController, 
  cartCtrl: CartController
)(implicit val system: ActorSystem[_], executionContext: ExecutionContext) {

  val corsSettings = CorsSettings.defaultSettings
    .withAllowedOrigins(HttpOriginMatcher(
      "http://localhost:3000",
      "http://localhost:9000",
      "https://louann-dejected-bilaterally.ngrok-free.dev"
    ))
    .withAllowedMethods(List(GET, POST, PUT, DELETE, OPTIONS))

  val route = cors(corsSettings) {
  pathPrefix("api") {
    path("products") {
      get {
        val data = productCtrl.getAll.map(p => s"${p.id}: ${p.name} (${p.price} PLN)").mkString("\n")
        complete(data)
      } ~
      post {
        productCtrl.create(Product(99, "Nowy Produkt", 10.0))
        complete("Produkt o ID 99 zostal dodany do ListBuffer")
      }
    } ~
    path("products" / IntNumber) { id =>
      put {
        if (productCtrl.updatePrice(id, 9.99)) complete(s"Cena produktu $id zmieniona na 9.99")
        else complete(404, s"Nie znaleziono produktu o ID $id")
      } ~
      delete {
        if (productCtrl.delete(id)) complete(s"Produkt $id usuniety")
        else complete(404, s"Brak produktu $id do usuniecia")
      }
    }
  }
}

  def start(): Unit = {
  val bindingFuture = Http().newServerAt("0.0.0.0", 8080).bind(route)
  println("Serwer HTTP uruchomiony na porcie 8080. Nacisnij Ctrl+C aby zakonczyc...")
  
  Await.result(system.whenTerminated, Duration.Inf)
}
}