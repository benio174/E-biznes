scalaVersion := "3.2.2"

libraryDependencies ++= Seq(
  ("com.typesafe.akka" %% "akka-http" % "10.5.0").cross(CrossVersion.for3Use2_13),
  ("com.typesafe.akka" %% "akka-http-spray-json" % "10.5.0").cross(CrossVersion.for3Use2_13),
  ("com.typesafe.akka" %% "akka-actor-typed" % "2.8.0").cross(CrossVersion.for3Use2_13),
  ("com.typesafe.akka" %% "akka-stream" % "2.8.0").cross(CrossVersion.for3Use2_13),
  ("ch.megard" %% "akka-http-cors" % "1.2.0").cross(CrossVersion.for3Use2_13)
)