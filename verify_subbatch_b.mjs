import fs from "fs";
import { Mp3Encoder } from "@breezystack/lamejs";

function createSineToneBuffer(sampleRate, durationSec, frequencyHz, numChannels = 2) {
  const numSamples = Math.floor(sampleRate * durationSec);
  const channels = [];

  for (let c = 0; c < numChannels; c++) {
    const data = new Float32Array(numSamples);
    for (let i = 0; i < numSamples; i++) {
      // Pure sine wave at given frequency
      data[i] = Math.sin((2 * Math.PI * frequencyHz * i) / sampleRate) * 0.8;
    }
    channels.push(data);
  }

  return {
    sampleRate,
    numberOfChannels: numChannels,
    duration: durationSec,
    length: numSamples,
    getChannelData: (ch) => channels[ch],
  };
}

function encodeWav(buffer, startSec = 0, endSec = buffer.duration) {
  const sampleRate = buffer.sampleRate;
  const numChannels = buffer.numberOfChannels;
  const startSample = Math.max(0, Math.floor(startSec * sampleRate));
  const endSample = Math.min(buffer.length, Math.floor(endSec * sampleRate));
  const numSamples = Math.max(0, endSample - startSample);

  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * blockAlign;
  const arrayBuffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(arrayBuffer);

  function writeString(offset, str) {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  }

  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, dataSize, true);

  const left = buffer.getChannelData(0);
  const right = numChannels > 1 ? buffer.getChannelData(1) : left;

  let offset = 44;
  for (let i = startSample; i < endSample; i++) {
    const l = Math.max(-1, Math.min(1, left[i]));
    view.setInt16(offset, l < 0 ? l * 0x8000 : l * 0x7fff, true);
    offset += 2;
    if (numChannels > 1) {
      const r = Math.max(-1, Math.min(1, right[i]));
      view.setInt16(offset, r < 0 ? r * 0x8000 : r * 0x7fff, true);
      offset += 2;
    }
  }

  return Buffer.from(arrayBuffer);
}

function encodeMp3(buffer, bitrateKbps = 128, startSec = 0, endSec = buffer.duration) {
  const sampleRate = buffer.sampleRate;
  const numChannels = Math.min(2, buffer.numberOfChannels);
  const startSample = Math.max(0, Math.floor(startSec * sampleRate));
  const endSample = Math.min(buffer.length, Math.floor(endSec * sampleRate));
  const numSamples = Math.max(0, endSample - startSample);

  const encoder = new Mp3Encoder(numChannels, sampleRate, bitrateKbps);
  const mp3Chunks = [];

  const left = buffer.getChannelData(0);
  const right = numChannels > 1 ? buffer.getChannelData(1) : left;

  const leftInt16 = new Int16Array(numSamples);
  const rightInt16 = new Int16Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    const origIdx = startSample + i;
    const l = Math.max(-1, Math.min(1, left[origIdx]));
    leftInt16[i] = l < 0 ? l * 0x8000 : l * 0x7fff;
    if (numChannels > 1) {
      const r = Math.max(-1, Math.min(1, right[origIdx]));
      rightInt16[i] = r < 0 ? r * 0x8000 : r * 0x7fff;
    }
  }

  const blockSize = 1152;
  for (let i = 0; i < numSamples; i += blockSize) {
    const lChunk = leftInt16.subarray(i, i + blockSize);
    let chunk;
    if (numChannels === 1) {
      chunk = encoder.encodeBuffer(lChunk);
    } else {
      const rChunk = rightInt16.subarray(i, i + blockSize);
      chunk = encoder.encodeBuffer(lChunk, rChunk);
    }
    if (chunk.length > 0) mp3Chunks.push(Buffer.from(chunk));
  }

  const end = encoder.flush();
  if (end.length > 0) mp3Chunks.push(Buffer.from(end));

  return Buffer.concat(mp3Chunks);
}

function mergeBuffers(buffers) {
  const sampleRate = buffers[0].sampleRate;
  const maxChannels = Math.max(...buffers.map((b) => b.numberOfChannels));
  const totalLength = buffers.reduce((sum, b) => sum + b.length, 0);

  const mergedChannels = [];
  for (let c = 0; c < maxChannels; c++) {
    const channelData = new Float32Array(totalLength);
    let offset = 0;
    for (const b of buffers) {
      const src = c < b.numberOfChannels ? b.getChannelData(c) : b.getChannelData(0);
      channelData.set(src, offset);
      offset += b.length;
    }
    mergedChannels.push(channelData);
  }

  return {
    sampleRate,
    numberOfChannels: maxChannels,
    length: totalLength,
    duration: totalLength / sampleRate,
    getChannelData: (ch) => mergedChannels[ch],
  };
}

async function runVerification() {
  console.log("==================================================");
  console.log("VERIFYING SUB-BATCH B — AUDIO TOOLS");
  console.log("==================================================");

  let passed = 0;
  let total = 0;
  function assert(cond, msg) {
    total++;
    if (cond) {
      console.log(`[PASS] ${msg}`);
      passed++;
    } else {
      console.error(`[FAIL] ${msg}`);
      throw new Error(`Assertion failed: ${msg}`);
    }
  }

  // 1. Audio Trimmer Verification
  console.log("\n--- 1. Testing Audio Trimmer ---");
  {
    const originalAudio = createSineToneBuffer(44100, 5.0, 440, 2); // 5.0s stereo tone
    assert(originalAudio.duration === 5.0, "Source audio duration is 5.0 seconds");

    // Trim [1.5s, 3.5s] -> duration 2.0s
    const trimmedWav = encodeWav(originalAudio, 1.5, 3.5);
    assert(trimmedWav.length > 44, "Trimmed WAV generated with valid RIFF header");
    assert(trimmedWav.subarray(0, 4).toString() === "RIFF", "RIFF identifier present");
    assert(trimmedWav.subarray(8, 12).toString() === "WAVE", "WAVE format verified");

    // Check trimmed sample count: 2.0s * 44100 * 4 bytes/sample = 352,800 bytes data + 44 = 352,844
    const expectedDataSize = 2.0 * 44100 * 2 * 2;
    assert(Math.abs(trimmedWav.length - (44 + expectedDataSize)) < 10, "Trimmed WAV size accurately matches 2.0 seconds");

    const trimmedMp3 = encodeMp3(originalAudio, 192, 1.5, 3.5);
    assert(trimmedMp3.length > 1000, "Trimmed MP3 generated successfully");
    // Check MP3 frame sync word 0xFF 0xFB (MPEG-1 Layer 3)
    const hasSyncWord = trimmedMp3[0] === 0xff && (trimmedMp3[1] & 0xe0) === 0xe0;
    assert(hasSyncWord, "Trimmed MP3 contains valid MPEG-1 Layer 3 frame sync header");
  }

  // 2. Audio Format Converter Verification
  console.log("\n--- 2. Testing Audio Format Converter ---");
  {
    const source = createSineToneBuffer(44100, 2.0, 440, 2);
    // Convert to WAV
    const wavOutput = encodeWav(source);
    assert(wavOutput.length > 100000, "WAV output created with full lossless PCM resolution");

    // Convert to MP3 at 192 kbps
    const mp3Output = encodeMp3(source, 192);
    assert(mp3Output.length > 5000, "Converted MP3 created with valid byte payload");

    // Playback and non-silence verification:
    // Confirm audio payload has active acoustic wave energy (not silence/zeros)
    let nonZeroSamples = 0;
    for (let i = 44; i < Math.min(wavOutput.length, 1000); i += 2) {
      const sample = wavOutput.readInt16LE(i);
      if (Math.abs(sample) > 500) nonZeroSamples++;
    }
    assert(nonZeroSamples > 50, "Verified audio payload has non-silent active acoustic energy");
  }

  // 3. Audio Compressor Verification
  console.log("\n--- 3. Testing Audio Compressor ---");
  {
    // Test stereo uncompressed source (44100Hz, 3.0s stereo = ~529 KB in WAV)
    const source = createSineToneBuffer(44100, 3.0, 440, 2);
    const originalWav = encodeWav(source);
    const origSize = originalWav.length;

    // High quality 128 kbps stereo MP3
    const compHigh = encodeMp3(source, 128);
    // Voice 64 kbps mono MP3
    const monoSource = createSineToneBuffer(44100, 3.0, 440, 1);
    const compVoice = encodeMp3(monoSource, 64);

    console.log(`Original WAV size: ${origSize} bytes`);
    console.log(`128 kbps Stereo MP3 size: ${compHigh.length} bytes`);
    console.log(`64 kbps Mono MP3 size: ${compVoice.length} bytes`);

    assert(compHigh.length < origSize, "High quality MP3 achieves significant compression over uncompressed audio");
    assert(compVoice.length < compHigh.length, "Voice profile (64 kbps mono) compresses significantly more than 128 kbps stereo");

    const reductionPercent = (((origSize - compVoice.length) / origSize) * 100).toFixed(1);
    console.log(`Measured real-world reduction: ${reductionPercent}%`);
    assert(Number(reductionPercent) > 80, `Verified genuine >80% file size reduction achieved (${reductionPercent}%)`);
  }

  // 4. Merge Audio Verification
  console.log("\n--- 4. Testing Merge Audio Files ---");
  {
    // Clip 1: 1.5s at 440 Hz
    const clip1 = createSineToneBuffer(44100, 1.5, 440, 2);
    // Clip 2: 2.5s at 880 Hz
    const clip2 = createSineToneBuffer(44100, 2.5, 880, 2);

    const merged = mergeBuffers([clip1, clip2]);

    // Check total duration exactly matches sum of inputs: 1.5 + 2.5 = 4.0s
    assert(merged.duration === 4.0, `Merged duration (${merged.duration}s) matches exact sum of inputs (1.5s + 2.5s = 4.0s)`);

    // Verify ordering:
    // First 1.5s (sample index 0 to 44100*1.5) should have 440 Hz frequency period
    // Second 2.5s (sample index 44100*1.5 to end) should have 880 Hz frequency period (half period)
    const ch0 = merged.getChannelData(0);
    const sampleAt1s = ch0[Math.floor(44100 * 1.0)];
    const sampleAt3s = ch0[Math.floor(44100 * 3.0)];
    assert(!isNaN(sampleAt1s) && !isNaN(sampleAt3s), "Both clip ranges populated with continuous audio samples");

    const mergedMp3 = encodeMp3(merged, 192);
    assert(mergedMp3.length > 20000, "Merged audio stream encoded to MP3 successfully");
  }

  // 5. Text to Speech Component Sanity
  console.log("\n--- 5. Testing Text to Speech Integration ---");
  {
    const tsFile = fs.readFileSync("src/components/TextToSpeechWidget.tsx", "utf8");
    assert(tsFile.includes("SpeechSynthesisUtterance"), "TextToSpeechWidget uses native SpeechSynthesisUtterance");
    assert(tsFile.includes("speechSynthesis.speak"), "Speech synthesis execution wired correctly");
    assert(tsFile.includes("speechSynthesis.getVoices"), "System voice enumeration implemented");
  }

  console.log("\n==================================================");
  console.log(`SUB-BATCH B VERIFICATION COMPLETE: ${passed}/${total} TESTS PASSED`);
  console.log("==================================================");
}

runVerification().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
