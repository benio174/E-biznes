package org.example

import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.websocket.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.client.request.*
import io.ktor.client.call.*
import io.ktor.http.*
import io.ktor.websocket.*
import kotlinx.coroutines.*
import kotlinx.serialization.json.*

fun main() = runBlocking {
    val token = System.getenv("DISCORD_TOKEN") ?: ""
    
    val httpClient = HttpClient(CIO) {
        install(WebSockets)
        install(ContentNegotiation) { json() }
    }

    // Funkcja przesyłająca tekst do Pythona
    suspend fun askPythonAI(userMessage: String): String {
        return try {
            val response = httpClient.post("http://host.docker.internal:8000/analyze") {
                contentType(ContentType.Application.Json)
                setBody(buildJsonObject { put("text", userMessage) })
            }
            val jsonResponse = response.body<JsonObject>()
            jsonResponse["reply"]?.jsonPrimitive?.content ?: "Brak odpowiedzi od AI."
        } catch (e: Exception) {
            "Błąd połączenia z modułem AI: ${e.message}"
        }
    }

    suspend fun sendDiscordMessage(channelId: String, text: String) {
        try {
            httpClient.post("https://discord.com/api/v10/channels/$channelId/messages") {
                header(HttpHeaders.Authorization, "Bot $token")
                contentType(ContentType.Application.Json)
                setBody(buildJsonObject { put("content", text) })
            }
        } catch (e: Exception) {
            println("Błąd wysyłania na Discord: ${e.message}")
        }
    }

    println("Punkt 3.5: Bot w Kotlinie nasłuchuje na Discordzie...")

    httpClient.wss("wss://gateway.discord.gg/?v=10&encoding=json") {
        for (frame in incoming) {
            if (frame is Frame.Text) {
                val responseText = frame.readText()
                val json = Json.parseToJsonElement(responseText).jsonObject
                
                if (json["op"]?.jsonPrimitive?.int == 10) {
                    send("""{"op":2,"d":{"token":"$token","intents":33280,"properties":{"os":"linux","browser":"ktor","device":"ktor"}}}""")
                }

                if (json["t"]?.jsonPrimitive?.content == "MESSAGE_CREATE") {
                    val data = json["d"]?.jsonObject
                    val content = data?.get("content")?.jsonPrimitive?.content ?: ""
                    val channelId = data?.get("channel_id")?.jsonPrimitive?.content ?: ""
                    val isBot = data?.get("author")?.jsonObject?.get("bot")?.jsonPrimitive?.booleanOrNull ?: false

                    if (!isBot && content.isNotEmpty()) {
                        println("[DISCORD] Odebrano wiadomość: $content")
                        val aiReply = askPythonAI(content)
                        sendDiscordMessage(channelId, aiReply)
                    }
                }
            }
        }
    }
}