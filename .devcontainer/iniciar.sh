#!/bin/sh
# Liga o servidor do petshop em segundo plano toda vez que o Codespace inicia - [Otávio Michels]
# O setsid evita que o servidor morra quando o Codespaces encerra este comando
setsid -f npm start > /tmp/petshop.log 2>&1

# A porta 3000 volta a ser privada quando o Codespace reinicia e sempre que o VS Code se conecta;
# a cada 30 s confere a visibilidade e, se estiver privada, deixa pública de novo - [Otávio Michels]
setsid -f sh -c 'while true; do
    v=$(gh codespace ports -c "$CODESPACE_NAME" --json sourcePort,visibility -q ".[] | select(.sourcePort == 3000) | .visibility" 2>/dev/null)
    if [ -n "$v" ] && [ "$v" != "public" ]; then
        gh codespace ports visibility 3000:public -c "$CODESPACE_NAME" && echo "$(date +%T) porta 3000 voltou a ser pública"
    fi
    sleep 30
done' > /tmp/porta-publica.log 2>&1
