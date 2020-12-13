require("dotenv").config();
import { Telegraf } from "telegraf";
import { TelegrafContext } from "telegraf/typings/context";
import consola from "consola";
import { Dream } from "./dream";
import { SpeechRecognizer } from "./speech";
import * as util from "util";
import { Arango } from "./arango";

export class Bot {
  private static $ = new Telegraf(String(process.env.BOT_TOKEN));

  private static handleError(message: string, context: TelegrafContext) {
    consola.error("ERROR: " + message);
    context.reply(`oh no, there has been an error :/\n${message}`);
  }

  private static async onAudioReceived(context: TelegrafContext) {
    context.reply("💭 Analisando seu aúdio...");
    const fileId = context.message?.voice?.file_id || "";
    if (!fileId) {
      Bot.handleError("No voice file found!", context);
    }
    const voiceFile = await context.telegram.getFileLink(fileId);
    const transcription = await SpeechRecognizer.textFromURL(voiceFile);
    if (!transcription?.length) {
      Bot.handleError("Não consegui entender :/", context);
    } else {
      const [{ alternatives: best }] = transcription;
      const text = (best || [])[0]?.transcript || "";
      const dream = new Dream({
        body: text,
        user: String(context.from?.id) || null,
      });
      context.replyWithHTML(`<b>Quite a dream!</b>\n${text.slice(0, 100)}...`);
      await dream.save();
    }
  }

  private static async onList(context: TelegrafContext) {
    const dreams = await Dream.getFromUser(String(context.from?.id));
    for (const dream of dreams.slice(0, 3)) {
      context.replyWithHTML(`
                <i>${new Date(dream.date || "").toDateString()}</i>
                <pre>${dream.body}</pre>
            `);
    }
  }

  static start() {
    consola.info("Starting bot...");
    Bot.$.on("voice", Bot.onAudioReceived);

    Bot.$.command("list", Bot.onList);

    Bot.$.launch();
  }
}
