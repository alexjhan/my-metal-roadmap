Write-Host "Abriendo editor de roadmaps en modo desarrollo..." -ForegroundColor Green
Start-Process "http://localhost:3000/edit/termodinamica"
Write-Host ""
Write-Host "Si el servidor no está corriendo, ejecuta: npm start" -ForegroundColor Yellow
Write-Host ""
Read-Host "Presiona Enter para continuar" 