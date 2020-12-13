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

// const { Database, aql } = require("arangojs");

// const db = new Database();
// const pokemons = db.collection("my-pokemons");

// async function main() {
//   try {
//     const pokemons = await db.query(aql`
//       FOR pokemon IN ${pokemons}
//       FILTER pokemon.type == "fire"
//       RETURN pokemon
//     `);
//     console.log("My pokemons, let me show you them:");
//     for await (const pokemon of pokemons) {
//       console.log(pokemon.name);
//     }
//   } catch (err) {
//     console.error(err.message);
//   }
// }
