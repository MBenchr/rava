import { readdir, rename } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const root = process.cwd();
const publicRoot = path.join(root, "public/viaire");
const digitalSourceType =
  "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia";
const xmp = `<?xpacket begin="\uFEFF" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description
      rdf:about=""
      xmlns:Iptc4xmpExt="http://iptc.org/std/Iptc4xmpExt/2008-02-29/"
      Iptc4xmpExt:DigitalSourceType="${digitalSourceType}" />
  </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;

async function collectWebpFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory()
        ? collectWebpFiles(entryPath)
        : entry.name.endsWith(".webp")
          ? [entryPath]
          : [];
    }),
  );

  return nested.flat();
}

const files = await collectWebpFiles(publicRoot);
let tagged = 0;

for (const file of files) {
  const metadata = await sharp(file).metadata();
  if (metadata.xmp?.includes(Buffer.from(digitalSourceType))) continue;

  const temporaryFile = `${file}.metadata-temp.webp`;
  await sharp(file)
    .withXmp(xmp)
    .webp({ quality: 96, effort: 6, smartSubsample: true })
    .toFile(temporaryFile);
  await rename(temporaryFile, file);
  tagged += 1;
}

console.log(`Tagged ${tagged} of ${files.length} VIAIRE WebP assets.`);
