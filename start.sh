#!/bin/bash

# need tmux nohup

# vars
sleepTime=20
jarFIle=/home/ruhan/Documents/mc/server.jar
tmux_name=server
botServer=/home/ruhan/Documents/mc/bot_server

# kill ngrok and server and bot
kil() {
    echo "[CLEANUP] Killing Minecraft server, bot, and ngrok..."
    pkill -f "$jarFIle" &>/dev/null
    pkill -f 'ngrok' &>/dev/null
    pkill -f "$botServer" &>/dev/null
    tmux kill-session -t "$tmux_name" 2>/dev/null
}

# delete session lock
echo "Cleaning up session.lock files..."
find ./world* -name "session.lock" -exec rm -f {} \;
# open backend
echo "Starting backend..."

nohup "$botServer" >/dev/null 2>&1 &
BOT_PID=$!
# start server
tmux new-session -d -s $tmux_name "java -Xmx1024M -Xms1024M -jar $jarFIle nogui"
echo "Server is Starting..."

# w8
sleep $sleepTime

if tmux has-session -t "$tmux_name" 2>/dev/null; then
    start_time=$(date +%s)
    echo "Server is running <3."

else
    echo "Server failed to start :C."
    exit 1
fi

# start ngrok
nohup ngrok tcp 25565 >/dev/null 2>&1 &
NGROK_PID=$!
sleep 5
NGROK_TUNNEL=$(curl --silent http://localhost:4040/api/tunnels | grep -o 'tcp://[^"]*')
# send this to backend
curl -X POST http://localhost:5000/ip-to-user \
    -H "Content-Type: application/json" \
    -d '{"ip": "'"$NGROK_TUNNEL"'"}'
# watchdog
(
    while tmux has-session -t "$tmux_name" 2>/dev/null; do
        sleep 30
    done
    end_time=$(date +%s)
    uptime=$((end_time - start_time))
    # send this to backend
    curl -X POST http://localhost:5000/stop \
        -H "Content-Type: application/json" \
        -d "{\"time\": $uptime}" &
    sleep 5
    echo "Cleaning up..."
    kill $PID &>/dev/null
    kill $NGROK_PID &>/dev/null
    $botServer stop
    kil
    # trap kil EXIT
) &
# oping tmux
tmux attach -t $tmux_name
