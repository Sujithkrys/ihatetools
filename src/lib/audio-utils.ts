import { Mp3Encoder } from "@breezystack/lamejs";

/**
 * Decode an audio File or ArrayBuffer into a Web Audio API AudioBuffer.
 */
export async function decodeAudioData(
  data: ArrayBuffer | Blob
): Promise<{ buffer: AudioBuffer; audioCtx: AudioContext }> {
  const arrayBuffer = data instanceof Blob ? await data.arrayBuffer() : data;
  const AudioContextClass =
    window.AudioContext ||
    // @ts-expect-error webkitAudioContext fallback
    window.webkitAudioContext;
  const audioCtx = new AudioContextClass();
  // decodeAudioData consumes the array buffer, pass a slice
  const buffer = await audioCtx.decodeAudioData(arrayBuffer.slice(0));
  return { buffer, audioCtx };
}

/**
 * Encode an AudioBuffer into standard 16-bit PCM WAV Blob
 */
export function audioBufferToWav(
  buffer: AudioBuffer,
  startSec = 0,
  endSec = buffer.duration
): Blob {
  const sampleRate = buffer.sampleRate;
  const numChannels = buffer.numberOfChannels;
  const startSample = Math.max(0, Math.floor(startSec * sampleRate));
  const endSample = Math.min(buffer.length, Math.floor(endSec * sampleRate));
  const numSamples = Math.max(0, endSample - startSample);

  // 16-bit PCM -> 2 bytes per sample
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * blockAlign;
  const wavBuffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(wavBuffer);

  // RIFF identifier
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");

  // fmt subchunk
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true); // SubChunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true); // BitsPerSample

  // data subchunk
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  // Interleave channels & write 16-bit PCM
  const channels: Float32Array[] = [];
  for (let c = 0; c < numChannels; c++) {
    channels.push(buffer.getChannelData(c));
  }

  let offset = 44;
  for (let i = startSample; i < endSample; i++) {
    for (let c = 0; c < numChannels; c++) {
      const sample = Math.max(-1, Math.min(1, channels[c][i]));
      // Convert Float32 (-1.0 to 1.0) to signed 16-bit integer
      const int16 = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, int16, true);
      offset += 2;
    }
  }

  return new Blob([wavBuffer], { type: "audio/wav" });
}

/**
 * Encode an AudioBuffer into MP3 format via LAME MP3 Encoder
 */
export function audioBufferToMp3(
  buffer: AudioBuffer,
  bitrateKbps = 128,
  startSec = 0,
  endSec = buffer.duration
): Blob {
  const sampleRate = buffer.sampleRate;
  const numChannels = Math.min(2, buffer.numberOfChannels); // 1 or 2
  const startSample = Math.max(0, Math.floor(startSec * sampleRate));
  const endSample = Math.min(buffer.length, Math.floor(endSec * sampleRate));
  const numSamples = Math.max(0, endSample - startSample);

  const encoder = new Mp3Encoder(numChannels, sampleRate, bitrateKbps);
  const mp3Data: Uint8Array[] = [];

  const leftChannel = buffer.getChannelData(0);
  const rightChannel = numChannels > 1 ? buffer.getChannelData(1) : leftChannel;

  // Convert Float32 to Int16
  const leftInt16 = new Int16Array(numSamples);
  const rightInt16 = new Int16Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    const origIdx = startSample + i;
    const l = Math.max(-1, Math.min(1, leftChannel[origIdx]));
    leftInt16[i] = l < 0 ? l * 0x8000 : l * 0x7fff;

    if (numChannels > 1) {
      const r = Math.max(-1, Math.min(1, rightChannel[origIdx]));
      rightInt16[i] = r < 0 ? r * 0x8000 : r * 0x7fff;
    }
  }

  const sampleBlockSize = 1152;
  for (let i = 0; i < numSamples; i += sampleBlockSize) {
    const leftChunk = leftInt16.subarray(i, i + sampleBlockSize);
    let mp3buf: Uint8Array;
    if (numChannels === 1) {
      mp3buf = encoder.encodeBuffer(leftChunk);
    } else {
      const rightChunk = rightInt16.subarray(i, i + sampleBlockSize);
      mp3buf = encoder.encodeBuffer(leftChunk, rightChunk);
    }
    if (mp3buf.length > 0) {
      mp3Data.push(mp3buf);
    }
  }

  const end = encoder.flush();
  if (end.length > 0) {
    mp3Data.push(end);
  }

  return new Blob(mp3Data as unknown as BlobPart[], { type: "audio/mp3" });
}

/**
 * Merge multiple AudioBuffers sequentially into a single AudioBuffer
 */
export function mergeAudioBuffers(
  audioCtx: AudioContext,
  buffers: AudioBuffer[]
): AudioBuffer {
  if (buffers.length === 0) {
    throw new Error("No audio buffers to merge.");
  }

  const sampleRate = buffers[0].sampleRate;
  let maxChannels = 1;
  let totalLength = 0;

  for (const b of buffers) {
    totalLength += Math.round(b.duration * sampleRate);
    if (b.numberOfChannels > maxChannels) maxChannels = b.numberOfChannels;
  }

  const merged = audioCtx.createBuffer(maxChannels, totalLength, sampleRate);

  for (let c = 0; c < maxChannels; c++) {
    const channelData = merged.getChannelData(c);
    let currentOffset = 0;

    for (const b of buffers) {
      // If source buffer has this channel, copy it; else fallback to channel 0
      const sourceChannel =
        c < b.numberOfChannels ? b.getChannelData(c) : b.getChannelData(0);

      // If sample rates match, copy directly; otherwise resample simply
      if (b.sampleRate === sampleRate) {
        channelData.set(sourceChannel, currentOffset);
        currentOffset += sourceChannel.length;
      } else {
        const factor = b.sampleRate / sampleRate;
        const targetLen = Math.round(b.length / factor);
        for (let i = 0; i < targetLen; i++) {
          const srcIdx = Math.min(b.length - 1, Math.round(i * factor));
          channelData[currentOffset + i] = sourceChannel[srcIdx];
        }
        currentOffset += targetLen;
      }
    }
  }

  return merged;
}

/**
 * Draw interactive waveform onto HTML5 canvas
 */
export function drawWaveform(
  canvas: HTMLCanvasElement,
  buffer: AudioBuffer,
  startPercent = 0,
  endPercent = 1,
  cursorPercent: number | null = null
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);

  const rawData = buffer.getChannelData(0);
  const totalSamples = rawData.length;
  const step = Math.ceil(totalSamples / width);
  const amp = height / 2;

  // Background grid lines
  ctx.strokeStyle = "rgba(150, 150, 150, 0.15)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, amp);
  ctx.lineTo(width, amp);
  ctx.stroke();

  // Draw waveform bars
  const startPx = Math.floor(startPercent * width);
  const endPx = Math.floor(endPercent * width);

  for (let i = 0; i < width; i++) {
    let min = 1.0;
    let max = -1.0;
    const startIdx = i * step;
    const endIdx = Math.min(startIdx + step, totalSamples);

    for (let j = startIdx; j < endIdx; j++) {
      const datum = rawData[j];
      if (datum < min) min = datum;
      if (datum > max) max = datum;
    }

    const inRange = i >= startPx && i <= endPx;
    ctx.fillStyle = inRange ? "#F5C242" : "rgba(150, 150, 150, 0.35)";

    const barHeight = Math.max(2, (max - min) * amp * 0.9);
    const y = amp - barHeight / 2;
    ctx.fillRect(i, y, 1.2, barHeight);
  }

  // Draw start & end marker lines
  ctx.strokeStyle = "#2A2200";
  ctx.lineWidth = 2;

  // Start Line
  ctx.beginPath();
  ctx.moveTo(startPx, 0);
  ctx.lineTo(startPx, height);
  ctx.stroke();

  // End Line
  ctx.beginPath();
  ctx.moveTo(endPx, 0);
  ctx.lineTo(endPx, height);
  ctx.stroke();

  // Playback Cursor
  if (cursorPercent !== null && cursorPercent >= 0 && cursorPercent <= 1) {
    const curPx = cursorPercent * width;
    ctx.strokeStyle = "#EF4444";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(curPx, 0);
    ctx.lineTo(curPx, height);
    ctx.stroke();
  }
}

function writeString(view: DataView, offset: number, string: string): void {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}.${ms < 10 ? "0" : ""}${ms}`;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
