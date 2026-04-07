package org.example

import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.websocket.*
import io.ktor.websocket.*
import kotlinx.coroutines.*
import kotlinx.serialization.json.*

fun main() = runBlocking {
    val token = System.getenv("DISCORD_TOKEN") ?: ""
    
    val client = HttpClient(CIO) {
        install(WebSockets)
    }

    println("Punkt 3.5: Bot uruchomiony. Nasłuchiwanie wiadomości...")

    client.wss("wss://gateway.discord.gg/?v=10&encoding=json") {
        for (frame in incoming) {
            if (frame is Frame.Text) {
                val response = frame.readText()
                val json = Json.parseToJsonElement(response).jsonObject
                
                if (json["op"]?.jsonPrimitive?.int == 10) {
                    val identifyPayload = """{
                        "op": 2,
                        "d": {
                            "token": "$token",
                            "intents": 33280,
                            "properties": { "os": "linux", "browser": "ktor", "device": "ktor" }
                        }
                    }"""
                    send(identifyPayload)
                }

                if (json["t"]?.jsonPrimitive?.content == "MESSAGE_CREATE") {
                    val data = json["d"]?.jsonObject
                    val content = data?.get("content")?.jsonPrimitive?.content
                    val author = data?.get("author")?.jsonObject?.get("username")?.jsonPrimitive?.content
                    
                    println("ODBRANO: [$author] -> $content")
                }
            }
        }
    }
}