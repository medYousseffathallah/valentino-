# Fix Calentine Project Permission Issues
# Run this script as Administrator

Write-Host "Fixing Calentine project permission issues..." -ForegroundColor Yellow
Write-Host ""

try {
    Write-Host "1. Terminating any running Node.js processes..." -ForegroundColor Cyan
    Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

    Write-Host "2. Taking ownership of project files..." -ForegroundColor Cyan
    $projectPath = $PWD.Path
    $nodeModulesPath = Join-Path $projectPath "node_modules"
    
    if (Test-Path $nodeModulesPath) {
        Write-Host "3. Deleting node_modules directory..." -ForegroundColor Cyan
        Remove-Item -Path $nodeModulesPath -Recurse -Force

        Write-Host "4. Deleting package-lock.json..." -ForegroundColor Cyan
        if (Test-Path "package-lock.json") {
            Remove-Item -Path "package-lock.json" -Force
        }

        Write-Host ""
        Write-Host "✅ Successfully cleaned up node_modules!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Now you can run 'npm install' to reinstall dependencies" -ForegroundColor Yellow
    } else {
        Write-Host "✅ node_modules directory not found, no cleanup needed" -ForegroundColor Green
    }

} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    
    Write-Host ""
    Write-Host "If this fails, try these manual steps:" -ForegroundColor Yellow
    Write-Host "1. Close all code editors and terminals that might be using these files"
    Write-Host "2. Disable any antivirus software temporarily"
    Write-Host "3. Open PowerShell as Administrator"
    Write-Host "4. Run this script again"
}
