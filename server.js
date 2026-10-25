// =====================================
// GESTURE STUDIO WEBSOCKET SERVER
// =====================================

const WebSocket = require("ws");

const PORT = 3000;


const wss = new WebSocket.Server({
    port: PORT
});


console.log("");
console.log("🥽 GESTURE STUDIO SERVER");
console.log("");
console.log(`📡 Porta: ${PORT}`);
console.log("⏳ Aguardando conexão...");
console.log("");


wss.on("connection", (socket) => {

    console.log("🟢 Novo dispositivo conectado");


    socket.send(
        JSON.stringify({

            type: "connection",

            status: "connected",

            message:
                "Gesture Studio conectado!"

        })
    );


    socket.on("message", (data) => {

        try {

            const mensagem =
                JSON.parse(
                    data.toString()
                );


            console.log(
                "📨 Recebido:",
                mensagem
            );


            // =================================
            // GESTO
            // =================================

            if (
                mensagem.type ===
                "gesture"
            ) {

                console.log("");

                console.log(
                    `🖐️ Gesto: ${mensagem.gesture}`
                );

                console.log(
                    `🎯 Confiança: ${mensagem.confidence}%`
                );

                console.log(
                    `⚡ Ação: ${mensagem.action}`
                );

                console.log("");



                // Resposta

                socket.send(

                    JSON.stringify({

                        type:
                            "gesture_received",

                        gesture:
                            mensagem.gesture,

                        action:
                            mensagem.action,

                        receivedAt:
                            Date.now()

                    })

                );

            }

        }

        catch (erro) {

            console.error(
                "❌ Mensagem inválida:",
                erro.message
            );

        }

    });


    socket.on("close", () => {

        console.log(
            "🔴 Dispositivo desconectado"
        );

    });


    socket.on("error", (erro) => {

        console.error(
            "❌ WebSocket:",
            erro.message
        );

    });

});
