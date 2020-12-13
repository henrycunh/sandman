import * as speech from "@google-cloud/speech";
import axios from "axios";

export class SpeechRecognizer {
  private static client = new speech.SpeechClient();

  private static getSpeechAPIRequest(
    audioBytes: string
  ): speech.protos.google.cloud.speech.v1.IRecognizeRequest {
    return {
      audio: {
        content: audioBytes,
      },
      config: {
        encoding: "OGG_OPUS",
        sampleRateHertz: 48000,
        languageCode: "pt-BR",
      },
    };
  }

  static async textFromURL(url: string) {
    const { data } = await axios.get(url, { responseType: "arraybuffer" });
    const buffer = Buffer.from(data, "binary");
    const encoded = buffer.toString("base64");
    const request = SpeechRecognizer.getSpeechAPIRequest(encoded);
    const [response] = await SpeechRecognizer.client.recognize(request);
    return response.results;
  }
}
