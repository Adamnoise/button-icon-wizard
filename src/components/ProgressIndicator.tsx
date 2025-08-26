import React from 'react';
import { CheckCircle, Circle, Clock } from 'lucide-react';

interface ProgressIndicatorProps {
  progress: number;
  label: string;
  currentStep: number;
}

interface StepData {
  id: number;
  title: string;
  description: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  progress, 
  label, 
  currentStep 
}) => {
  const steps: StepData[] = [
    { id: 0, title: 'Kapcsolódás', description: 'Figma API kapcsolat' },
    { id: 1, title: 'Letöltés', description: 'Design fájl elemzése' },
    { id: 2, title: 'Feldolgozás', description: 'Struktúra feltérképezése' },
    { id: 3, title: 'CSS generálás', description: 'Layout és stílusok' },
    { id: 4, title: 'JavaScript', description: 'Interakciók létrehozása' },
    { id: 5, title: 'Optimalizálás', description: 'Kód validálás' },
    { id: 6, title: 'Befejezés', description: 'Exportálás' }
  ];

  const getStepStatus = (stepId: number): 'completed' | 'current' | 'pending' => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'pending';
  };

  const getStepIcon = (stepId: number) => {
    const status = getStepStatus(stepId);
    const iconProps = {
      className: "w-4 h-4",
      strokeWidth: 1.5,
      'aria-hidden': true as const
    };

    switch (status) {
      case 'completed':
        return <CheckCircle {...iconProps} className="w-4 h-4 text-emerald-400" />;
      case 'current':
        return <Clock {...iconProps} className="w-4 h-4 text-blue-400 animate-pulse" />;
      default:
        return <Circle {...iconProps} className="w-4 h-4 text-white/30" />;
    }
  };

  const getStepStyles = (stepId: number): string => {
    const status = getStepStatus(stepId);
    
    switch (status) {
      case 'completed':
        return 'text-emerald-300 bg-emerald-500/10 border-emerald-400/20';
      case 'current':
        return 'text-blue-300 bg-blue-500/20 border-blue-400/30 shadow-lg shadow-blue-500/20';
      default:
        return 'text-white/40 bg-white/5 border-white/10';
    }
  };

  return (
    <div className="space-y-6" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/80 font-medium" aria-live="polite">
            {label}
          </span>
          <span className="text-white/60 tabular-nums">
            {Math.round(progress)}%
          </span>
        </div>
        
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`
              relative p-3 rounded-xl border transition-all duration-300
              ${getStepStyles(step.id)}
            `}
          >
            <div className="flex items-center gap-2 mb-1">
              {getStepIcon(step.id)}
              <div className="text-xs font-medium leading-tight">
                {step.title}
              </div>
            </div>
            <div className="text-xs opacity-80 leading-tight">
              {step.description}
            </div>
            
            {/* Active step indicator */}
            {getStepStatus(step.id) === 'current' && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white/20 animate-pulse" />
            )}
          </div>
        ))}
      </div>

      {/* Current Step Details */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            {getStepIcon(currentStep)}
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-white/90">
              {steps[currentStep]?.title || 'Feldolgozás...'}
            </div>
            <div className="text-xs text-white/60 mt-1" aria-live="polite">
              {label}
            </div>
          </div>
          <div className="flex-shrink-0 text-xs text-white/50 tabular-nums">
            {currentStep + 1} / {steps.length}
          </div>
        </div>
        
        {/* Progress visualization */}
        <div className="mt-3 flex items-center gap-1">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`
                h-1 flex-1 rounded-full transition-all duration-300
                ${index < currentStep ? 'bg-emerald-400' : 
                  index === currentStep ? 'bg-blue-400 animate-pulse' : 'bg-white/20'}
              `}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      {/* Accessibility */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Konvertálás folyamatban: {Math.round(progress)}% kész. 
        Jelenlegi lépés: {steps[currentStep]?.title}. {label}
      </div>
    </div>
  );
};

export default React.memo(ProgressIndicator);