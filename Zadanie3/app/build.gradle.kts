plugins {
    kotlin("jvm") version "1.9.22"
    kotlin("plugin.serialization") version "1.9.22"
    application
}

kotlin {
    jvmToolchain(17)
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("io.ktor:ktor-client-core:2.3.9")
    implementation("io.ktor:ktor-client-cio:2.3.9")
    implementation("io.ktor:ktor-client-content-negotiation:2.3.9")
    implementation("io.ktor:ktor-serialization-kotlinx-json:2.3.9")
    implementation("io.ktor:ktor-client-websockets:2.3.9")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.8.0")
    implementation(kotlin("stdlib"))
}


application {
    mainClass.set("org.example.AppKt")
}

tasks.withType<JavaExec> {
    systemProperty("discordToken", project.findProperty("discordToken") ?: "")
    systemProperty("channelId", project.findProperty("channelId") ?: "")
}