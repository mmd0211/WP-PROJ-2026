import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const sampleRate = 8000;
const durationSeconds = 8;
const amplitude = 0.22;
const frequencies = [220, 247, 262, 294, 330, 349];

function makeWav(frequency) {
  const sampleCount = sampleRate * durationSeconds;
  const dataSize = sampleCount * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < sampleCount; i += 1) {
    const attack = Math.min(1, i / (sampleRate * 0.08));
    const release = Math.min(1, (sampleCount - i) / (sampleRate * 0.15));
    const envelope = Math.min(attack, release);
    const sample = Math.sin((2 * Math.PI * frequency * i) / sampleRate) * amplitude * envelope;
    buffer.writeInt16LE(Math.round(sample * 32767), 44 + i * 2);
  }

  return buffer;
}

const outputDir = path.resolve('public/audio');
await mkdir(outputDir, { recursive: true });

await Promise.all(
  frequencies.map((frequency, index) =>
    writeFile(path.join(outputDir, `track${index + 1}.wav`), makeWav(frequency)),
  ),
);

console.log('Generated 6 local demo WAV files in public/audio/.');
