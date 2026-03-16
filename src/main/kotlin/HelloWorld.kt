import java.sql.DriverManager

fun main() {
    println("Hello World")
    
    val url = "jdbc:sqlite:test.db"
    try {
        val connection = DriverManager.getConnection(url)
        val statement = connection.createStatement()
        statement.execute("CREATE TABLE IF NOT EXISTS test (msg TEXT)")
        statement.execute("INSERT INTO test (msg) VALUES ('Baza SQLite dziala poprawnie!')")
        
        val rs = statement.executeQuery("SELECT msg FROM test LIMIT 1")
        while (rs.next()) {
            println("Odpowiedz z bazy: " + rs.getString("msg"))
        }
        connection.close()
    } catch (e: Exception) {
        println("Blad: \${e.message}")
    }
}