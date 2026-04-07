package org.example

import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.request.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.http.*
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put

fun main() = runBlocking {
    val client = HttpClient(CIO) {
        install(ContentNegotiation) {
            json()
        }
    }

    val token = System.getenv("DISCORD_TOKEN") ?: ""
    val channelId = System.getenv("CHANNEL_ID") ?: ""

    try {
        val response = client.post("https://discord.com/api/v10/channels/$channelId/messages") {
            header(HttpHeaders.Authorization, "Bot $token")
            contentType(ContentType.Application.Json)
            setBody(buildJsonObject {
                put("content", "Hej")
            })
        }
        
        println("Status: ${response.status}")
        
        if (response.status == HttpStatusCode.OK || response.status == HttpStatusCode.Created) {
        }
    } catch (e: Exception) {
        println("Błąd: ${e.message}")
    } finally {
        client.close()
    }
}