export class GestureRecorder {

    constructor() {

        console.log(
            "🔥 RECORDER V0.2 — 50 AMOSTRAS"
        );

        this.recording = false;

        this.samples = [];

        this.maxSamples = 50;

        this.interval = 100;

        this.lastCapture = 0;

        this.onSample = null;

        this.onFinished = null;

    }


    // =================================
    // INICIAR
    // =================================

    start() {

        this.recording = true;

        this.samples = [];

        this.lastCapture = 0;

        console.log(
            "🔴 Gravação iniciada"
        );

    }


    // =================================
    // RECEBER LANDMARKS
    // =================================

    update(landmarks, timestamp) {

        if (!this.recording) {

            return;

        }


        if (
            timestamp -
            this.lastCapture <
            this.interval
        ) {

            return;

        }


        this.lastCapture =
            timestamp;


        const sample =
            landmarks.map(
                (ponto) => ({

                    x: ponto.x,

                    y: ponto.y,

                    z: ponto.z

                })
            );


        this.samples.push(
            sample
        );


        console.log(
            `📸 Amostra ${this.samples.length}/${this.maxSamples}`
        );


        if (this.onSample) {

            this.onSample(

                this.samples.length,

                this.maxSamples

            );

        }


        if (
            this.samples.length >=
            this.maxSamples
        ) {

            this.stop();

        }

    }


    // =================================
    // PARAR
    // =================================

    stop() {

        if (!this.recording) {

            return;

        }


        this.recording = false;


        console.log(
            "⏹️ Gravação finalizada"
        );


        console.log(
            "Total:",
            this.samples.length
        );


        if (this.onFinished) {

            this.onFinished(
                this.samples
            );

        }

    }


    // =================================
    // LIMPAR
    // =================================

    clear() {

        this.samples = [];

        this.recording = false;

    }


    // =================================
    // PEGAR AMOSTRAS
    // =================================

    getSamples() {

        return this.samples;

    }

}
