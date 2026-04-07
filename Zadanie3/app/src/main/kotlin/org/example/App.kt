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
        install(ContentNegotiation) {
            json()
        }
    }

    suspend fun sendMessage(channelId: String, text: String) {
        try {
            client.post("https://discord.com/api/v10/channels/$channelId/messages") {
                header(HttpHeaders.Authorization, "Bot $token")
                contentType(ContentType.Application.Json)
                setBody(buildJsonObject { put("content", text) })
            }
        } catch (e: Exception) {
            println("Błąd wysyłania: ${e.message}")
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
                    val author = data?.get("author")?.jsonObject?.get("username")?.jsonPrimitive?.content

                    println("Odebrano od $author: $content")

                    if (content == "!kategorie") {
                        val listaKategorii = """
                            **Dostępne kategorie:**
                            1. Elektronika
                            2. Moda
                            3. Dom i Ogród
                            4. Sport
                        """.trimIndent()
                        
                        sendMessage(channelId, listaKategorii)
                        println("Wysłano listę kategorii na kanał $channelId")
                    }
                }
            }
        }
    }
}