import {
  pipeline,
  AutoTokenizer,
  AutoModelForTextToWaveform,
} from "@xenova/transformers";
import wavefile from "wavefile";
import fs from "fs";

const emb =
  "https://huggingface.co/facebook/mms-tts-spa/blob/main/pytorch_model.bin";

async function main() {
  // Cargar el tokenizadors
  // const tokenizer = await AutoTokenizer.from_pretrained(
  //   "facebook/mms-tts-spa"
  // ).then((token) => {
  //   return token;
  // });

  // Cargar el modelo
  // const model = await AutoModelForTextToWaveform.from_pretrained(
  //   "facebook/mms-tts-spa"
  // ).then((model) => {
  //   return model;
  // });

  // Crear el pipeline con el tokenizador y el modelo
  const pipe = await pipeline("text-to-speech", "facebook/mms-tts-spa", {
    quantized: false,
  });

  // Generar la salida de audio
  const output = await pipe("hola mundo", { speaker_embeddings: emb });

  // Escribir el archivo de audio
  const wav = new wavefile.WaveFile(output.audio);
  wav.fromScratch(1, output.sampling_rate, "32f", output.audio);
  fs.writeFileSync("output.wav", wav.toBuffer());
}

main();
