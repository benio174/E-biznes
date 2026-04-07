package org.example

import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.websocket.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.websocket.*
import kotlinx.coroutines.*
import kotlinx.serialization.json.*

fun main() = runBlocking {
    val token = System.getenv("DISCORD_TOKEN") ?: ""
    
    val client = HttpClient(CIO) {
        install(WebSockets)
        install(ContentNegotiation) { json() }
    }

    val bazaProduktow = mapOf(
        "Elektronika" to listOf("Laptop", "Smartfon", "Słuchawki"),
        "Moda" to listOf("Koszulka", "Spodnie", "Buty"),
        "Sport" to listOf("Piłka", "Rakieta", "Mata do jogi")
    )

    suspend fun sendMessage(channelId: String, text: String) {
        client.post("https://discord.com/api/v10/channels/$channelId/messages") {
            header(HttpHeaders.Authorization, "Bot $token")
            contentType(ContentType.Application.Json)
            setBody(buildJsonObject { put("content", text) })
        }
    }

    client.wss("wss://gateway.discord.gg/?v=10&encoding=json") {
        for (frame in incoming) {
            if (frame is Frame.Text) {
                val response = frame.readText()
                val json = Json.parseToJsonElement(response).jsonObject
                
                if (json["op"]?.jsonPrimitive?.int == 10) {
                    send("""{"op":2,"d":{"token":"$token","intents":33280,"properties":{"os":"linux","browser":"ktor","device":"ktor"}}}""")
                }

                if (json["t"]?.jsonPrimitive?.content == "MESSAGE_CREATE") {
                    val data = json["d"]?.jsonObject
                    val content = data?.get("content")?.jsonPrimitive?.content ?: ""
                    val channelId = data?.get("channel_id")?.jsonPrimitive?.content ?: ""

                    if (content == "!kategorie") {
                        val msg = "**Kategorie:** " + bazaProduktow.keys.joinToString(", ")
                        sendMessage(channelId, msg)
                    }

                    if (content.startsWith("!produkty")) {
                        val kategoria = content.removePrefix("!produkty").trim()
                        val produkty = bazaProduktow[kategoria]

                        val odpowiedz = if (produkty != null) {
                            "**Produkty w kategorii $kategoria:**\n" + produkty.joinToString("\n") { "- $it" }
                        } else {
                            "Nie znaleziono kategorii '$kategoria'. Spróbuj: !produkty Elektronika"
                        }
                        
                        sendMessage(channelId, odpowiedz)
                    }
                }
            }
        }
    }
}