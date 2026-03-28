# =============================================================
# FosholHaat Dev Stack — start-all.ps1
# Usage:  .\scripts\dev\start-all.ps1
#
# This script delegates everything to a tmux session inside WSL
# so that the servers remain alive after the script finishes.
# =============================================================

$wslPath = "/home/god_himself_wsl/FosholHaat-CSE299"

Write-Host ""
Write-Host "--- FosholHaat Dev Stack ---" -ForegroundColor Cyan
Write-Host ""

# Run the bash script which handles tmux, cleanup, and browser opening
wsl bash -c "chmod +x $wslPath/scripts/dev/start-all.sh && $wslPath/scripts/dev/start-all.sh"

Write-Host ""
Write-Host "Done! Servers are running in a tmux session inside WSL." -ForegroundColor Green
Write-Host "  To see live logs:   wsl tmux attach -t fosholhaat" -ForegroundColor Yellow
Write-Host "  To stop everything: wsl tmux kill-session -t fosholhaat" -ForegroundColor Yellow
Write-Host ""
