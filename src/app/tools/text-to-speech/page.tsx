import { Metadata } from "next";
import { ToolWidgetShell } from "@/components/ToolWidgetShell";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { FAQAccordion } from "@/components/FAQAccordion";
import { RelatedTools } from "@/components/RelatedTools";
import { TextToSpeechWidget } from "@/components/TextToSpeechWidget";

export const metadata: Metadata = {
  title: "Text to Speech - Free On-Device Voice Synthesizer | ihatetools",
  description: "Convert text into spoken audio directly in your browser using native on-device speech synthesis. Adjust speed, pitch, and voice with zero cloud tracking.",
};

const HOW_IT_WORKS_STEPS = [
  {
    title: "Enter or Paste Text",
    description: "Type, paste, or select demo text to read aloud.",
  },
  {
    title: "Customize Voice & Speed",
    description: "Choose from any installed system voices on your device, and fine-tune rate and pitch sliders.",
  },
  {
    title: "Listen with Word Tracking",
    description: "Play speech with real-time word highlighting, pause, or resume on demand.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Is this speech synthesis private?",
    answer: "Yes! Unlike cloud TTS APIs that send your text to third-party servers, this tool utilizes your operating system's native SpeechSynthesis engine directly on your device.",
  },
  {
    question: "Why can't I download the speech directly as an MP3 file?",
    answer: "Web browser security specifications intentionally prevent JavaScript applications from tapping into the raw operating system synthesizer audio output without requesting microphone capture permissions. Immediate high-fidelity on-device playback is provided.",
  },
  {
    question: "How do I get more voices?",
    answer: "The tool automatically detects all voices installed in your operating system (Windows Speech, macOS Siri/System Voices, Android, or iOS). Installing additional language packs on your computer adds more voices automatically.",
  },
];

const RELATED_TOOLS = [
  { name: "Audio Format Converter", href: "/tools/audio-converter" },
  { name: "Audio Trimmer", href: "/tools/audio-trimmer" },
  { name: "Word Counter", href: "/tools/word-counter" },
];

export default function TextToSpeechPage() {
  return (
    <div className="max-w-content mx-auto px-4 md:px-[34px] pt-[40px] pb-[60px]">
      <section className="text-center max-w-2xl mx-auto mb-[24px]">
        <h1 className="disp disp-lg text-[clamp(30px,4vw,46px)] text-ink mb-[12px]">
          Text to Speech
        </h1>
        <p className="disp text-[clamp(18px,2.5vw,25px)] text-ink/80">
          Synthesize natural speech from text using your device&apos;s built-in voice engine. 100% on-device and private.
        </p>
      </section>

      <ToolWidgetShell breadcrumbs="ihatetools / audio / text-to-speech">
        <TextToSpeechWidget />
      </ToolWidgetShell>

      <div className="mt-12 space-y-12">
        <HowItWorksSteps steps={HOW_IT_WORKS_STEPS} />
        <FAQAccordion items={FAQ_ITEMS} />
        <RelatedTools tools={RELATED_TOOLS} />
      </div>
    </div>
  );
}
