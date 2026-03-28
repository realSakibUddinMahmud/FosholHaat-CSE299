#!/bin/bash

# =============================================================
# FosholHaat Dev Stack — start-all.sh
# Usage:  ./scripts/dev/start-all.sh
#
# WHY TMUX?
# When you run  wsl bash -c "nohup X &"  from PowerShell,
# WSL tears down the entire Linux process tree the moment the
# bash -c command exits.  tmux keeps a server process alive
# inside WSL, so child processes survive indefinitely.
# =============================================================

REPO="/home/god_himself_wsl/FosholHaat-CSE299"
SESSION="fosholhaat"

# ---- 1. Kill any previous run ------------------------------------
tmux kill-session -t "$SESSION" 2>/dev/null
fuser -k 3000/tcp 3001/tcp 8081/tcp 2>/dev/null
sleep 1

# ---- 2. Clean stale caches --------------------------------------
rm -rf "$REPO/apps/web/.next" "$REPO/apps/api/dist"

# ---- 3. Start a new tmux session with three windows -------------
# Window 0 — API (port 3000)
tmux new-session -d -s "$SESSION" -n api -c "$REPO/apps/api" \
  "npm run start:dev 2>&1 | tee $REPO/api.log"

# Window 1 — Web (port 3001)
tmux new-window -t "$SESSION" -n web -c "$REPO/apps/web" \
  "npm run dev -- -p 3001 2>&1 | tee $REPO/web.log"

# Window 2 — Mobile (port 8081)
tmux new-window -t "$SESSION" -n mobile -c "$REPO/apps/mobile" \
  "npm run start 2>&1 | tee $REPO/mobile.log"

echo ""
echo "✅  Dev stack launched inside tmux session '$SESSION'"
echo ""
echo "   API   → http://localhost:3000"
echo "   Web   → http://localhost:3001/login"
echo "   Mobile→ http://localhost:8081"
echo ""
echo "   View logs:   tmux attach -t $SESSION"
echo "   Stop all:    tmux kill-session -t $SESSION"
echo ""

# ---- 4. Wait for servers, then open browser ----------------------
echo "⏳  Waiting 20s for initial bundling…"
sleep 20

# Open browser tabs (works from WSL → Windows)
explorer.exe "http://localhost:3001/login" 2>/dev/null
explorer.exe "http://localhost:8081"       2>/dev/null
explorer.exe "http://localhost:3000"       2>/dev/null

echo "🚀  Browser tabs opened. Happy coding!"
