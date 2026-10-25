export class GestureRecognizer {

    constructor(storage) {

        this.storage = storage;

        this.gestures = [];

        // Quantos frames analisamos
        this.historySize = 8;

        // Histórico dos resultados
        this.history = [];

        // Intervalo entre análises
        this.interval = 80;

        this.lastUpdate = 0;

        this.onResult = null;

    }


    // =====================================
    // CARREGAR GESTOS
    // =====================================

    async load() {

        this.gestures =
            await this.storage.getAll();

        this.history = [];

        console.log(
            "🧠 Gestos carregados:",
            this.gestures.length
        );

    }


    // =====================================
    // NORMALIZAR
    // =====================================

    normalize(landmarks) {

        if (
            !landmarks ||
            landmarks.length !== 21
        ) {

            return null;

        }


        const wrist =
            landmarks[0];


        const pontos =
            landmarks.map(
                (ponto) => ({

                    x:
                        ponto.x -
                        wrist.x,

                    y:
                        ponto.y -
                        wrist.y,

                    z:
                        ponto.z -
                        wrist.z

                })
            );


        let maiorDistancia = 0;


        for (
            const ponto
            of pontos
        ) {

            const distancia =

                Math.sqrt(

                    ponto.x * ponto.x +

                    ponto.y * ponto.y +

                    ponto.z * ponto.z

                );


            if (
                distancia >
                maiorDistancia
            ) {

                maiorDistancia =
                    distancia;

            }

        }


        if (
            maiorDistancia === 0
        ) {

            return pontos;

        }


        return pontos.map(
            (ponto) => ({

                x:
                    ponto.x /
                    maiorDistancia,

                y:
                    ponto.y /
                    maiorDistancia,

                z:
                    ponto.z /
                    maiorDistancia

            })
        );

    }


    // =====================================
    // DISTÂNCIA
    // =====================================

    distance(handA, handB) {

        if (
            !handA ||
            !handB
        ) {

            return Infinity;

        }


        let total = 0;


        for (
            let i = 0;
            i < 21;
            i++
        ) {

            const dx =
                handA[i].x -
                handB[i].x;


            const dy =
                handA[i].y -
                handB[i].y;


            const dz =
                handA[i].z -
                handB[i].z;


            total +=

                Math.sqrt(

                    dx * dx +

                    dy * dy +

                    dz * dz

                );

        }


        return total / 21;

    }


    // =====================================
    // DISTÂNCIA → CONFIANÇA
    // =====================================

    score(distance) {

        const valor =
            1 - distance;


        return Math.max(
            0,
            Math.min(
                1,
                valor
            )
        ) * 100;

    }


    // =====================================
    // RECONHECER UM FRAME
    // =====================================

    recognize(landmarks) {

        if (
            this.gestures.length === 0
        ) {

            return null;

        }


        const atual =
            this.normalize(
                landmarks
            );


        if (!atual) {

            return null;

        }


        let melhor = null;


        for (
            const gesto
            of this.gestures
        ) {

            let melhorDistancia =
                Infinity;


            for (
                const sample
                of gesto.samples
            ) {

                const normalizado =
                    this.normalize(
                        sample
                    );


                const distancia =
                    this.distance(
                        atual,
                        normalizado
                    );


                if (
                    distancia <
                    melhorDistancia
                ) {

                    melhorDistancia =
                        distancia;

                }

            }


            const confianca =
                this.score(
                    melhorDistancia
                );


            if (
                !melhor ||
                confianca >
                melhor.confidence
            ) {

                melhor = {

                    name:
                        gesto.name,

                    confidence:
                        confianca,

                    distance:
                        melhorDistancia

                };

            }

        }


        return melhor;

    }


    // =====================================
    // ADICIONAR AO HISTÓRICO
    // =====================================

    addToHistory(resultado) {

        if (!resultado) {

            return;

        }


        this.history.push(
            resultado
        );


        if (
            this.history.length >
            this.historySize
        ) {

            this.history.shift();

        }

    }


    // =====================================
    // RESULTADO ESTÁVEL
    // =====================================

    getStableResult() {

        if (
            this.history.length === 0
        ) {

            return null;

        }


        const grupos = {};


        for (
            const resultado
            of this.history
        ) {

            if (
                !grupos[resultado.name]
            ) {

                grupos[resultado.name] = {

                    count: 0,

                    confidence: 0

                };

            }


            grupos[
                resultado.name
            ].count++;


            grupos[
                resultado.name
            ].confidence +=
                resultado.confidence;

        }


        let melhorNome = null;

        let melhorCount = -1;

        let melhorConfianca = 0;


        for (
            const nome
            in grupos
        ) {

            const grupo =
                grupos[nome];


            const media =
                grupo.confidence /
                grupo.count;


            if (
                grupo.count >
                melhorCount
            ) {

                melhorNome =
                    nome;

                melhorCount =
                    grupo.count;

                melhorConfianca =
                    media;

            }

            else if (
                grupo.count ===
                melhorCount &&
                media >
                melhorConfianca
            ) {

                melhorNome =
                    nome;

                melhorConfianca =
                    media;

            }

        }


        return {

            name:
                melhorNome,

            confidence:
                melhorConfianca,

            stability:
                melhorCount /
                this.history.length

        };

    }


    // =====================================
    // ATUALIZAR
    // =====================================

    update(
        landmarks,
        timestamp
    ) {

        if (
            timestamp -
            this.lastUpdate <
            this.interval
        ) {

            return;

        }


        this.lastUpdate =
            timestamp;


        const resultado =
            this.recognize(
                landmarks
            );


        if (!resultado) {

            return;

        }


        this.addToHistory(
            resultado
        );


        const estavel =
            this.getStableResult();


        if (
            this.onResult
        ) {

            this.onResult(
                estavel,
                resultado
            );

        }

    }

}
