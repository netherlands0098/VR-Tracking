// =====================================
// GESTURE ACTIONS
// =====================================

export class GestureActions {

    constructor() {

        this.bindings = {};

        this.load();

    }


    // =====================================
    // CARREGAR
    // =====================================

    load() {

        try {

            const dados =
                localStorage.getItem(
                    "gesture-actions"
                );


            if (dados) {

                this.bindings =
                    JSON.parse(dados);

            }

        }

        catch (erro) {

            console.error(
                "❌ Erro ao carregar ações:",
                erro
            );

            this.bindings = {};

        }

    }


    // =====================================
    // SALVAR
    // =====================================

    save() {

        localStorage.setItem(
            "gesture-actions",
            JSON.stringify(
                this.bindings
            )
        );

    }


    // =====================================
    // ASSOCIAR
    // =====================================

    bind(
        gestureName,
        action
    ) {

        if (
            !action ||
            action === "none"
        ) {

            delete this.bindings[
                gestureName
            ];

        }

        else {

            this.bindings[
                gestureName
            ] = action;

        }


        this.save();


        console.log(
            `🔗 ${gestureName} → ${action}`
        );

    }


    // =====================================
    // REMOVER
    // =====================================

    unbind(
        gestureName
    ) {

        delete this.bindings[
            gestureName
        ];


        this.save();

    }


    // =====================================
    // OBTER
    // =====================================

    getAction(
        gestureName
    ) {

        return (

            this.bindings[
                gestureName
            ] || "none"

        );

    }


    // =====================================
    // EXECUTAR
    // =====================================

    execute(
        gestureName
    ) {

        const action =
            this.getAction(
                gestureName
            );


        if (
            action === "none"
        ) {

            return;

        }


        console.log(
            `⚡ ${gestureName} → ${action}`
        );


        switch (action) {


            case "click":

                this.click();

                break;


            case "double-click":

                this.doubleClick();

                break;


            case "right-click":

                this.rightClick();

                break;


            case "enter":

                this.key(
                    "Enter"
                );

                break;


            case "space":

                this.key(
                    " "
                );

                break;

        }

    }


    // =====================================
    // ELEMENTO NO CENTRO
    // =====================================

    getCenterElement() {

        return document.elementFromPoint(

            window.innerWidth / 2,

            window.innerHeight / 2

        );

    }


    // =====================================
    // CLICK
    // =====================================

    click() {

        const elemento =
            this.getCenterElement();


        if (elemento) {

            elemento.click();

        }


        console.log(
            "🖱️ CLICK"
        );

    }


    // =====================================
    // DUPLO CLICK
    // =====================================

    doubleClick() {

        const elemento =
            this.getCenterElement();


        if (elemento) {

            elemento.dispatchEvent(

                new MouseEvent(
                    "dblclick",
                    {
                        bubbles:
                            true,

                        cancelable:
                            true,

                        view:
                            window
                    }
                )

            );

        }


        console.log(
            "🖱️ DOUBLE CLICK"
        );

    }


    // =====================================
    // BOTÃO DIREITO
    // =====================================

    rightClick() {

        const elemento =
            this.getCenterElement();


        if (elemento) {

            elemento.dispatchEvent(

                new MouseEvent(
                    "contextmenu",
                    {
                        bubbles:
                            true,

                        cancelable:
                            true,

                        view:
                            window
                    }
                )

            );

        }


        console.log(
            "🖱️ RIGHT CLICK"
        );

    }


    // =====================================
    // TECLADO
    // =====================================

    key(
        tecla
    ) {

        document.dispatchEvent(

            new KeyboardEvent(
                "keydown",
                {
                    key:
                        tecla,

                    bubbles:
                        true,

                    cancelable:
                        true
                }
            )

        );


        console.log(
            `⌨️ ${tecla}`
        );

    }

}
