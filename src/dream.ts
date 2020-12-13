import { Arango } from "./arango";

export class Dream {
    body: string | null;
    user: string | null;
    date: string | null;

    constructor(params: IDreamConstructor) {
        this.body = params.body || null;
        this.user = params.user || null;
        this.date = new Date().toISOString();
    }

    async save() {
        await Arango.saveDocument(this, "dream-log");
    }

    static async getFromUser(user: string): Promise<Dream[]> {
        return await Arango.listDocuments({
            collection: "dream-log",
            condition: `item.user == '${user}'`,
        });
    }
}

interface IDreamConstructor {
    body: string | null;
    user: string | null;
}
