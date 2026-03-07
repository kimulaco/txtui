import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join, parse } from "node:path";
import ttf2woff2 from "ttf2woff2";

const INPUT_DIR = "src/assets/fonts";
const OUTPUT_DIR = "public/fonts";

const files = await readdir(INPUT_DIR);
const ttfFiles = files.filter((file) => file.toLowerCase().endsWith(".ttf"));

await mkdir(OUTPUT_DIR, { recursive: true });

for (const file of ttfFiles) {
  const inputPath = join(INPUT_DIR, file);
  const outputName = `${parse(file).name}.woff2`;
  const outputPath = join(OUTPUT_DIR, outputName);
  const inputBuffer = await readFile(inputPath);
  await writeFile(outputPath, ttf2woff2(inputBuffer));
  console.log(`Generated ${outputPath}`);
}
