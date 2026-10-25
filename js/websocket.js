// =====================================
// GESTURE STUDIO WEBSOCKET CLIENT
// =====================================

export class GestureWebSocket {

    constructor() {

        this.socket = null;

        this.connected = false;

        this.onMessage = null;

        this.onStatus = null;

    }


    // =====================================
    // CONECTAR
    // =====================================

    connect(
        url = "ws://127.0.0.1:3000"
    ) {

        console.log(
            "🔌 Conectando:",
            url
        );


        this.socket =
            new WebSocket(
                url
            );


        // =================================
        // CONECTADO
        // =================================

        this.socket.onopen =
            () => {

                this.connected =
                    true;


                console.log(
                    "🟢 WebSocket conectado!"
                );


                if (
                    this.onStatus
                ) {

                    this.onStatus(
                        "connected"
                    );

                }

            };


        // =================================
        // MENSAGEM
        // =================================

        this.socket.onmessage =
            (event) => {

                try {

                    const mensagem =
                        JSON.parse(
                            event.data
                        );


                    console.log(
                        "📨 Servidor:",
                        mensagem
                    );


                    if (
                        this.onMessage
                    ) {

                        this.onMessage(
                            mensagem
                        );

                    }

                }

                catch (erro) {

                    console.error(
                        "❌ Mensagem inválida:",
                        erro
                    );

                }

            };


        // =================================
        // DESCONECTADO
        // =================================

        this.socket.onclose =
            () => {

                this.connected =
                    false;


                console.log(
                    "🔴 WebSocket desconectado"
                );


                if (
                    this.onStatus
                ) {

                    this.onStatus(
                        "disconnected"
                    );

                }

            };


        // =================================
        // ERRO
        // =================================

        this.socket.onerror =
            (erro) => {

                console.error(
                    "❌ WebSocket:",
                    erro
                );


                if (
                    this.onStatus
                ) {

                    this.onStatus(
                        "error"
                    );

                }

            };

    }


    // =====================================
    // ENVIAR GESTO
    // =====================================

    sendGesture(
        gesture,
        confidence,
        action
    ) {


        if (
            !this.connected
        ) {

            console.warn(
                "⚠️ WebSocket desconectado"
            );


            return;

        }


        const mensagem = {

            type:
                "gesture",

            gesture:
                gesture,

            confidence:
                confidence,

            action:
                action,

            timestamp:
                Date.now()

        };


        this.socket.send(

            JSON.stringify(
                mensagem
            )

        );


        console.log(
            "📤 Enviado:",
            mensagem
        );

    }

}
