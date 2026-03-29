docker build -t ebiznes-app .

docker rm -f ebiznes-container

docker run -d -p 9000:8080 --name ebiznes-container ebiznes-app

Start-Sleep -s 15

ngrok http 9000