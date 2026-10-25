export class GestureQuality {

    constructor() {

        this.goodThreshold = 0.12;

        this.warningThreshold = 0.20;

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

    distance(a, b) {

        if (
            !a ||
            !b
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
                a[i].x -
                b[i].x;


            const dy =
                a[i].y -
                b[i].y;


            const dz =
                a[i].z -
                b[i].z;


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
    // CENTRO DO GESTO
    // =====================================

    getCenter(samples) {

        const normalizadas =
            samples
                .map(
                    sample =>
                        this.normalize(
                            sample
                        )
                )
                .filter(
                    sample =>
                        sample !== null
                );


        if (
            normalizadas.length === 0
        ) {

            return null;

        }


        const centro =
            Array.from(
                {
                    length: 21
                },
                () => ({

                    x: 0,
                    y: 0,
                    z: 0

                })
            );


        for (
            const sample
            of normalizadas
        ) {

            for (
                let i = 0;
                i < 21;
                i++
            ) {

                centro[i].x +=
                    sample[i].x;

                centro[i].y +=
                    sample[i].y;

                centro[i].z +=
                    sample[i].z;

            }

        }


        for (
            let i = 0;
            i < 21;
            i++
        ) {

            centro[i].x /=
                normalizadas.length;

            centro[i].y /=
                normalizadas.length;

            centro[i].z /=
                normalizadas.length;

        }


        return centro;

    }


    // =====================================
    // DESVIO POR DEDO
    // =====================================

    analyzeFingers(sample, centro) {

        if (
            !sample ||
            !centro
        ) {

            return [];

        }


        const normalizado =
            this.normalize(
                sample
            );


        if (!normalizado) {

            return [];

        }


        const dedos = [

            {
                name: "Polegar",
                emoji: "👍",
                start: 1,
                end: 4
            },

            {
                name: "Indicador",
                emoji: "☝️",
                start: 5,
                end: 8
            },

            {
                name: "Médio",
                emoji: "🖕",
                start: 9,
                end: 12
            },

            {
                name: "Anelar",
                emoji: "💍",
                start: 13,
                end: 16
            },

            {
                name: "Mínimo",
                emoji: "🤏",
                start: 17,
                end: 20
            }

        ];


        return dedos.map(
            dedo => {

                let total = 0;

                let quantidade = 0;


                for (
                    let i =
                        dedo.start;
                    i <=
                        dedo.end;
                    i++
                ) {

                    const dx =
                        normalizado[i].x -
                        centro[i].x;


                    const dy =
                        normalizado[i].y -
                        centro[i].y;


                    const dz =
                        normalizado[i].z -
                        centro[i].z;


                    total +=
                        Math.sqrt(
                            dx * dx +
                            dy * dy +
                            dz * dz
                        );


                    quantidade++;

                }


                const distance =
                    quantidade > 0
                        ? total / quantidade
                        : 0;


                let classification =
                    "good";


                if (
                    distance >
                    this.warningThreshold
                ) {

                    classification =
                        "bad";

                }

                else if (
                    distance >
                    this.goodThreshold
                ) {

                    classification =
                        "warning";

                }


                return {

                    name:
                        dedo.name,

                    emoji:
                        dedo.emoji,

                    distance:
                        distance,

                    classification:
                        classification

                };

            }
        );

    }


    // =====================================
    // DIAGNÓSTICO INTELIGENTE
    // =====================================

    getDiagnosis(fingers) {

        if (
            !Array.isArray(fingers) ||
            fingers.length === 0
        ) {

            return {

                level:
                    "unknown",

                message:
                    "Não foi possível analisar os dedos.",

                problematic:
                    []

            };

        }


        const problematic =
            fingers.filter(
                dedo =>
                    dedo.classification !==
                    "good"
            );


        if (
            problematic.length === 0
        ) {

            return {

                level:
                    "good",

                message:
                    "Todos os dedos estão consistentes com a referência.",

                problematic:
                    []

            };

        }


        const bad =
            fingers.filter(
                dedo =>
                    dedo.classification ===
                    "bad"
            );


        let level =
            "warning";


        if (
            bad.length >= 2
        ) {

            level =
                "bad";

        }


        const nomes =
            problematic.map(
                dedo =>
                    dedo.name
            );


        let message;


        if (
            level === "bad"
        ) {

            message =
                "Há muita variação em " +
                nomes.join(" e ") +
                ".";

        }

        else {

            message =
                "Há alguma variação em " +
                nomes.join(" e ") +
                ".";

        }


        return {

            level:
                level,

            message:
                message,

            problematic:
                problematic

        };

    }


    // =====================================
    // ANALISAR
    // =====================================

    analyze(samples) {

        if (
            !Array.isArray(samples) ||
            samples.length === 0
        ) {

            return {

                total: 0,

                good: 0,

                warning: 0,

                bad: 0,

                quality: 0,

                details: []

            };

        }


        const centro =
            this.getCenter(
                samples
            );


        if (!centro) {

            return {

                total: samples.length,

                good: 0,

                warning: 0,

                bad: samples.length,

                quality: 0,

                details: []

            };

        }


        const details = [];


        let good = 0;

        let warning = 0;

        let bad = 0;


        for (
            let i = 0;
            i < samples.length;
            i++
        ) {

            const normalizado =
                this.normalize(
                    samples[i]
                );


            const distancia =
                this.distance(
                    normalizado,
                    centro
                );


            let classification;


            if (
                distancia <=
                this.goodThreshold
            ) {

                classification =
                    "good";

                good++;

            }

            else if (
                distancia <=
                this.warningThreshold
            ) {

                classification =
                    "warning";

                warning++;

            }

            else {

                classification =
                    "bad";

                bad++;

            }


            const fingerAnalysis =
                this.analyzeFingers(
                    samples[i],
                    centro
                );


            details.push({

                index:
                    i,

                distance:
                    distancia,

                classification:
                    classification,

                fingers:
                    fingerAnalysis

            });

        }


        const quality =

            (

                (
                    good +
                    warning * 0.5
                )
                /
                samples.length

            ) * 100;


        return {

            total:
                samples.length,

            good:
                good,

            warning:
                warning,

            bad:
                bad,

            quality:
                quality,

            details:
                details

        };

    }

}
