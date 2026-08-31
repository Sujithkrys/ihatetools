interface Step {
  title: string;
  description: string;
}

interface HowItWorksStepsProps {
  steps: Step[];
}

export function HowItWorksSteps({ steps }: HowItWorksStepsProps) {
  return (
    <div className="w-full max-w-5xl mx-auto my-16 px-4">
      <h2 className="text-2xl font-semibold text-textPrimary text-center mb-10">
        How it works
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center text-center p-6 bg-surface border border-white/5 rounded-card"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-background border border-white/10 text-accent font-bold text-lg mb-6">
              {String(index + 1).padStart(2, '0')}
            </div>
            <h3 className="text-lg font-medium text-textPrimary mb-3">
              {step.title}
            </h3>
            <p className="text-textSecondary text-sm leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
