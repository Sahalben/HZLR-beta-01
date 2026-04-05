import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from './OnboardingLayout';
import { Step1AccountType } from './Step1AccountType';
import { Step2GSTVerify } from './Step2GSTVerify';
import { Step3CompanyDetails } from './Step3CompanyDetails';
import { Step4HiringProfile } from './Step4HiringProfile';
import { Step5Complete } from './Step5Complete';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export default function EmployerOnboarding() {
  const [step, setStep] = useState(1);
  const [employerType, setEmployerType] = useState<"individual" | "company" | null>(null);
  const navigate = useNavigate();
  const { profile, updateProfile, updateOnboardingState } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Payload collected across steps mapping identically to Prisma columns
  const [formData, setFormData] = useState({
      companyName: '',
      businessType: '',
      gstin: '',
      gstVerified: false,
      registeredAddress: '',
      operatingCities: [] as string[],
      contactPerson: '',
      designation: '',
      workerCategories: [] as string[],
      monthlyHiringVolume: '',
      preferredHiringMode: ''
  });

  const nextStep = () => {
     if (employerType === 'individual' && step === 1) {
         setStep(4); // Skip GST & Company Details
     } else {
         setStep(s => s + 1);
     }
  };

  const prevStep = () => {
     if (employerType === 'individual' && step === 4) {
         setStep(1);
     } else {
         setStep(s => Math.max(1, s - 1));
     }
  };

  const handleUpdateField = (fields: Partial<typeof formData>) => {
      setFormData(prev => ({ ...prev, ...fields }));
  };

  const saveAndComplete = async () => {
      setIsSubmitting(true);
      try {
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
          const token = localStorage.getItem('token');
          
          await fetch(`${API_URL}/api/v1/employers/profile`, {
             method: 'PUT',
             headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
             body: JSON.stringify({
                 employerType,
                 ...formData,
                 onboardingComplete: true,
                 onboardingStep: 5
             })
          });

          await updateOnboardingState('ONBOARDING_COMPLETE');
          navigate('/employer/home', { replace: true });
      } catch (e: any) {
          toast({ title: "Failed to persist profile", description: e.message, variant: 'destructive' });
      } finally {
          setIsSubmitting(false);
      }
  };

  return (
    <OnboardingLayout currentStep={step} type={employerType}>
        {step === 1 && <Step1AccountType 
            type={employerType} 
            onChange={setEmployerType} 
            onNext={nextStep} 
        />}
        {step === 2 && <Step2GSTVerify 
            formData={formData} 
            update={handleUpdateField} 
            onNext={nextStep} 
            onPrev={prevStep} 
        />}
        {step === 3 && <Step3CompanyDetails 
            formData={formData} 
            update={handleUpdateField} 
            onNext={nextStep} 
            onPrev={prevStep} 
        />}
        {step === 4 && <Step4HiringProfile 
            formData={formData} 
            update={handleUpdateField} 
            onNext={nextStep} 
            onPrev={prevStep} 
        />}
        {step === 5 && <Step5Complete 
            type={employerType} 
            onFinish={saveAndComplete} 
            isSubmitting={isSubmitting} 
            onPrev={prevStep} 
        />}
    </OnboardingLayout>
  );
}
