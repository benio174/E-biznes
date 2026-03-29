Write-Host "Zatrzymywanie starych procesów..." -ForegroundColor Yellow
docker stop zadanie2 2>$null
docker rm -f zadanie2 2>$null
docker rm -f ebiznes-container 2>$null

Write-Host "Budowanie obrazu..." -ForegroundColor Cyan
docker build --no-cache -t ebiznes-app .

Write-Host "Uruchamianie kontenera na porcie 9000..." -ForegroundColor Green
docker run -d -p 9000:8080 --name ebiznes-container ebiznes-app

Write-Host "Czekam 45 sekund na start Scali..." -ForegroundColor White
Start-Sleep -s 45

ngrok http 9000