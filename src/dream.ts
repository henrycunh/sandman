import { Arango } from "./arango";
import * as stopword from "stopword";
import { aql } from "arangojs";

export class Dream {
    body: string | null;
    bodyClean: string[] | null;
    user: string | null;
    date: string | null;

    constructor(params: IDreamConstructor) {
        this.body = params.body || null;
        this.bodyClean = Dream.clearBody(params.body);
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

    static async getCommonWordsFromUser(
        user: string,
        limit = 10
    ): Promise<{ word: string; count: number }[]> {
        const results = await Arango.query(aql`
            let words = flatten(
                for dream in \`dream-log\`
                    filter dream.user == '${aql.literal(user)}'
                    return dream.bodyClean
            )
            
            for wordOcc in words
                collect word = wordOcc with count into \`count\`
                sort \`count\` desc
                limit ${aql.literal(limit)}
                return { word, \`count\` }
        `);
        return results;
    }

    private static clearBody(body: string | null) {
        return stopword.removeStopwords(String(body).split(" "), stopword.ptbr);
    }
}

interface IDreamConstructor {
    body: string | null;
    user: string | null;
}
