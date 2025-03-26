import React, { useState } from 'react';
import PaymentForm from '@/components/PaymentForm';
import ApplicationForm from '@/components/ApplicationForm';
import DirectorApplicationForm from '@/components/DirectorApplicationForm'
import FormSuccess from '@/components/FormSuccess';
import { toast } from 'sonner';
import { Toaster } from "@/components/ui/sonner";
import { Button } from '@/components/ui/button';

const Index = () => {
  // Track application type and progress
  const [applicationType, setApplicationType] = useState<'none' | 'participant' | 'director'>('none');
  const [step, setStep] = useState<'select' | 'application' | 'payment' | 'success'>('select');
  const [transition, setTransition] = useState(false);

  // Handle application form completion - now goes to payment
  const handleApplicationSuccess = () => {
    setTransition(true);
    setTimeout(() => {
      setStep('payment');
      setTransition(false);
      toast.success("Application received! Please complete payment to finalize your submission.");
    }, 300);
  };

  // Handle payment form completion - only after payment is successful can the user see the success screen
  const handlePaymentSuccess = () => {
    setTransition(true);
    setTimeout(() => {
      setStep('success');
      setTransition(false);
      toast.success("Payment successful! Your application is now complete.");
    }, 300);
  };

  // Handle going back to application from payment
  const handleBackToApplication = () => {
    setTransition(true);
    setTimeout(() => {
      setStep('application');
      setTransition(false);
    }, 300);
  };
  
  // Handle going back to selection screen
  const handleBackToSelection = () => {
    setTransition(true);
    setTimeout(() => {
      setStep('select');
      setApplicationType('none');
      setTransition(false);
    }, 300);
  };

  // Handle selecting application type
  const handleSelectType = (type: 'participant' | 'director') => {
    setApplicationType(type);
    setTransition(true);
    setTimeout(() => {
      setStep('application');
      setTransition(false);
      toast.success(`${type === 'participant' ? 'Participant' : 'National Director'} application selected`);
    }, 300);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-gray-50 to-bloom-gold/30 overflow-x-hidden">
      <Toaster position="top-center" />
      <div className="w-full max-w-6xl mx-auto px-4 py-8">
        <div className={`transition-all duration-300 ${transition ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          {step === 'select' && (
            <div className="animate-slide-up">
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-bloom-primary mb-4">Welcome to Miss Bloom Global</h1>
                <p className="text-bloom-muted max-w-2xl mx-auto">Please select the application type you would like to complete.</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all border border-gray-100">
                  <h2 className="text-xl font-semibold mb-3 text-bloom-primary">Participant Application</h2>
                  <p className="text-bloom-muted mb-6">Apply to be a contestant in the Miss Bloom Global pageant.</p>
                  <Button 
                    onClick={() => handleSelectType('participant')}
                    className="w-full bg-bloom-gold text-bloom-primary hover:bg-bloom-gold/80"
                  >
                    Apply as Participant
                  </Button>
                </div>
                
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all border border-gray-100">
                  <h2 className="text-xl font-semibold mb-3 text-bloom-primary">National Director Application</h2>
                  <p className="text-bloom-muted mb-6">Apply to become a National Director for Miss Bloom Global.</p>
                  <Button 
                    onClick={() => handleSelectType('director')}
                    className="w-full bg-bloom-primary text-white hover:bg-bloom-primary/90"
                  >
                    Apply as Director
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {step === 'application' && applicationType === 'participant' && (
            <div className="animate-slide-up">
              <Button 
                onClick={handleBackToSelection}
                variant="outline"
                className="mb-4"
              >
                ← Back to selection
              </Button>
              <ApplicationForm 
                onSubmitSuccess={handleApplicationSuccess}
                onBack={handleBackToApplication}
              />
            </div>
          )}
          
          {step === 'application' && applicationType === 'director' && (
            <div className="animate-slide-up">
              <Button 
                onClick={handleBackToSelection}
                variant="outline"
                className="mb-4"
              >
                ← Back to selection
              </Button>
              <DirectorApplicationForm
                onSubmitSuccess={handleApplicationSuccess}
                onBack={handleBackToApplication}
              />
            </div>
          )}
          
          {step === 'payment' && (
            <div className="animate-slide-up">
              <PaymentForm 
                onPaymentSuccess={handlePaymentSuccess} 
                onBack={handleBackToApplication}
              />
            </div>
          )}
          
          {step === 'success' && (
            <div className="animate-slide-up">
              <FormSuccess />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;