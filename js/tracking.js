import {
    HandLandmarker,
    FilesetResolver
} from "../tasks-vision/vision_bundle.mjs";


// =====================================
// CONFIGURAÇÃO
// =====================================

const FPS = 20;
const INTERVALO = 1000 / FPS;

let ultimoFrame = 0;


// =====================================
// TRACKING ENGINE
// =====================================

export class HandTracking {

    constructor(video, canvas) {

        this.video = video;
        this.canvas = canvas;

        this.ctx =
            canvas.getContext("2d");

        this.handLandmarker = null;

        this.running = false;

        this.onHandDetected = null;

    }


    // =================================
    // INICIALIZAR MEDIAPIPE
    // =================================

    async init() {

        console.log(
            "📦 Carregando MediaPipe..."
        );


        const vision =
            await FilesetResolver
                .forVisionTasks(
                    "../tasks-vision/wasm"
                );


        console.log(
            "🧠 Carregando modelo..."
        );


        this.handLandmarker =
            await HandLandmarker
                .createFromOptions(
                    vision,
                    {

                        baseOptions: {

                            modelAssetPath:
                                "../models/hand_landmarker.task"

                        },

                        runningMode:
                            "VIDEO",

                        numHands: 1,

                        minHandDetectionConfidence:
                            0.5,

                        minHandPresenceConfidence:
                            0.5,

                        minTrackingConfidence:
                            0.5

                    }
                );


        console.log(
            "✅ MediaPipe carregado!"
        );

    }


    // =================================
    // INICIAR CÂMERA
    // =================================

    async startCamera() {


        const stream =
            await navigator
                .mediaDevices
                .getUserMedia({

                    video: {

                        facingMode:
                            "environment",

                        width: {

                            ideal: 480

                        },

                        height: {

                            ideal: 360

                        },

                        frameRate: {

                            ideal: 30,

                            max: 30

                        }

                    },

                    audio: false

                });


        this.video.srcObject =
            stream;


        await this.video.play();


        this.canvas.width =
            this.video.videoWidth;


        this.canvas.height =
            this.video.videoHeight;


        console.log(
            "📷 Câmera iniciada!"
        );


        this.running = true;


        requestAnimationFrame(
            (tempo) =>
                this.update(tempo)
        );

    }


    // =================================
    // LOOP
    // =================================

    update(tempo) {


        requestAnimationFrame(
            (novoTempo) =>
                this.update(novoTempo)
        );


        if (

            tempo -
            ultimoFrame <
            INTERVALO

        ) {

            return;

        }


        ultimoFrame =
            tempo;


        if (

            !this.handLandmarker ||
            this.video.readyState < 2

        ) {

            return;

        }


        const resultado =
            this.handLandmarker
                .detectForVideo(
                    this.video,
                    tempo
                );


        this.ctx.clearRect(

            0,
            0,

            this.canvas.width,
            this.canvas.height

        );


        // =================================
        // MÃO DETECTADA
        // =================================

        if (

            resultado.landmarks &&
            resultado.landmarks.length > 0

        ) {


            const landmarks =
                resultado.landmarks[0];


            this.drawLandmarks(
                landmarks
            );


            // Enviar dados para o resto
            // do sistema

            if (

                this.onHandDetected

            ) {

                this.onHandDetected(
                    landmarks
                );

            }

        }

    }


    // =================================
    // DESENHAR LANDMARKS
    // =================================

    drawLandmarks(landmarks) {


        for (

            const ponto
            of landmarks

        ) {


            const x =
                ponto.x *
                this.canvas.width;


            const y =
                ponto.y *
                this.canvas.height;


            this.ctx.beginPath();


            this.ctx.arc(

                x,
                y,

                4,

                0,
                Math.PI * 2

            );


            this.ctx.fillStyle =
                "lime";


            this.ctx.fill();

        }

    }

}
