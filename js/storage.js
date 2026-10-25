const DB_NAME = "GestureStudioDB";
const DB_VERSION = 1;
const STORE_NAME = "gestures";


export class GestureStorage {

    constructor() {

        this.db = null;

    }


    // =====================================
    // INICIAR BANCO
    // =====================================

    async init() {

        return new Promise((resolve, reject) => {

            const request =
                indexedDB.open(
                    DB_NAME,
                    DB_VERSION
                );


            request.onupgradeneeded =
                (event) => {

                    const db =
                        event.target.result;


                    if (
                        !db.objectStoreNames.contains(
                            STORE_NAME
                        )
                    ) {

                        db.createObjectStore(
                            STORE_NAME,
                            {
                                keyPath: "id",
                                autoIncrement: true
                            }
                        );

                    }

                };


            request.onsuccess =
                (event) => {

                    this.db =
                        event.target.result;


                    console.log(
                        "💾 IndexedDB iniciado"
                    );


                    resolve();

                };


            request.onerror =
                () => {

                    reject(
                        request.error
                    );

                };

        });

    }



    // =====================================
    // SALVAR NOVO GESTO
    // =====================================

    async save(gesture) {

        return new Promise(
            (resolve, reject) => {

                const transaction =
                    this.db.transaction(
                        STORE_NAME,
                        "readwrite"
                    );


                const store =
                    transaction.objectStore(
                        STORE_NAME
                    );


                const request =
                    store.add(
                        gesture
                    );


                request.onsuccess =
                    () => {

                        resolve(
                            request.result
                        );

                    };


                request.onerror =
                    () => {

                        reject(
                            request.error
                        );

                    };

            }
        );

    }



    // =====================================
    // ATUALIZAR GESTO
    // =====================================

    async update(gesture) {

        return new Promise(
            (resolve, reject) => {

                if (
                    gesture.id === undefined ||
                    gesture.id === null
                ) {

                    reject(
                        new Error(
                            "O gesto precisa ter um ID para ser atualizado."
                        )
                    );

                    return;

                }


                const transaction =
                    this.db.transaction(
                        STORE_NAME,
                        "readwrite"
                    );


                const store =
                    transaction.objectStore(
                        STORE_NAME
                    );


                const request =
                    store.put(
                        gesture
                    );


                request.onsuccess =
                    () => {

                        console.log(
                            "✏️ Gesto atualizado:",
                            gesture.id
                        );


                        resolve(
                            request.result
                        );

                    };


                request.onerror =
                    () => {

                        reject(
                            request.error
                        );

                    };

            }
        );

    }



    // =====================================
    // PEGAR UM GESTO
    // =====================================

    async get(id) {

        return new Promise(
            (resolve, reject) => {

                const transaction =
                    this.db.transaction(
                        STORE_NAME,
                        "readonly"
                    );


                const store =
                    transaction.objectStore(
                        STORE_NAME
                    );


                const request =
                    store.get(
                        id
                    );


                request.onsuccess =
                    () => {

                        resolve(
                            request.result
                        );

                    };


                request.onerror =
                    () => {

                        reject(
                            request.error
                        );

                    };

            }
        );

    }



    // =====================================
    // PEGAR TODOS
    // =====================================

    async getAll() {

        return new Promise(
            (resolve, reject) => {

                const transaction =
                    this.db.transaction(
                        STORE_NAME,
                        "readonly"
                    );


                const store =
                    transaction.objectStore(
                        STORE_NAME
                    );


                const request =
                    store.getAll();


                request.onsuccess =
                    () => {

                        resolve(
                            request.result
                        );

                    };


                request.onerror =
                    () => {

                        reject(
                            request.error
                        );

                    };

            }
        );

    }



    // =====================================
    // EXCLUIR
    // =====================================

    async delete(id) {

        return new Promise(
            (resolve, reject) => {

                const transaction =
                    this.db.transaction(
                        STORE_NAME,
                        "readwrite"
                    );


                const store =
                    transaction.objectStore(
                        STORE_NAME
                    );


                const request =
                    store.delete(
                        id
                    );


                request.onsuccess =
                    () => {

                        console.log(
                            "🗑️ Gesto excluído:",
                            id
                        );


                        resolve();

                    };


                request.onerror =
                    () => {

                        reject(
                            request.error
                        );

                    };

            }
        );

    }

}
