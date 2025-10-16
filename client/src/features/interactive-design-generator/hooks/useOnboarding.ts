import { useState } from "react";
import { ONBOARDING_STEPS } from "../constants";

export function useOnboarding() {
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const nextStep = () => {
    if (onboardingStep < ONBOARDING_STEPS.length - 1) {
      setOnboardingStep((prev) => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  const previousStep = () => {
    if (onboardingStep > 0) {
      setOnboardingStep((prev) => prev - 1);
    }
  };

  const skipOnboarding = () => {
    setIsComplete(true);
  };

  const resetOnboarding = () => {
    setOnboardingStep(0);
    setIsComplete(false);
  };

  const currentStep = ONBOARDING_STEPS[onboardingStep];
  const progress = ((onboardingStep + 1) / ONBOARDING_STEPS.length) * 100;

  return {
    onboardingStep,
    currentStep,
    progress,
    isComplete,
    nextStep,
    previousStep,
    skipOnboarding,
    resetOnboarding,
  };
}
