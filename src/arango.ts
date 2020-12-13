import { Database, aql } from "arangojs";

export class Arango {
    private static $ = new Database({
        url: process.env.ARANGO_HOST || "",
        auth: {
            username: process.env.ARANGO_USER || "",
            password: process.env.ARANGO_PASSWORD || "",
        },
    });

    static async saveDocument(document: any, collection: string) {
        const collectionClient = Arango.$.collection(collection);
        await collectionClient.save(document);
    }

    static async listDocuments(params: {
        condition?: string;
        collection: string;
    }) {
        return (
            await Arango.$.query(aql`
            for item in \`${aql.literal(params.collection)}\`
                ${aql.literal(
                    params.condition ? `filter ${params.condition}` : ""
                )}
                return item
        `)
        ).all();
    }
}
