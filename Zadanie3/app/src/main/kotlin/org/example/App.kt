package Zadanie3

import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.request.*
import io.ktor.http.*
import kotlinx.coroutines.runBlocking

val BOT_TOKEN = System.getProperty("discordToken") ?: ""
val CHANNEL_ID = System.getProperty("channelId") ?: ""

fun main() = runBlocking {
    val client = HttpClient(CIO)
    
    try {
        val response = client.post("https://discord.com/api/v10/channels/$CHANNEL_ID/messages") {
            header(HttpHeaders.Authorization, "Bot $BOT_TOKEN")
            contentType(ContentType.Application.Json)
            setBody("""{"content": "Witaj!"}""")
        }
        println("Status: ${response.status}")
    } catch (e: Exception) {
        println("Błąd: ${e.message}")
    } finally {
        client.close()
    }
}