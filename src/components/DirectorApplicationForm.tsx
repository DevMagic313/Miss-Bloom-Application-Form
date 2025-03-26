
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';

// Define the component props
export interface DirectorApplicationFormProps {
  onSubmitSuccess: () => void;
  onBack: () => void;
}

// Define the form schema using Zod
const directorFormSchema = z.object({
  // Contact Information
  fullName: z.string().min(2, { message: "Full name is required" }),
  email: z.string().email({ message: "Valid email address is required" }),
  phone: z.string().min(8, { message: "Valid phone number is required" }),
  country: z.string().min(2, { message: "Country is required" }),
  city: z.string().min(2, { message: "City is required" }),
  
  // Background and Experience
  workExperience: z.string().min(10, { message: "Work experience is required" }),
  education: z.string().min(5, { message: "Education information is required" }),
  skills: z.string().min(5, { message: "Skills information is required" }),
  
  // Motivation and Goals
  motivation: z.string().min(20, { message: "Please explain your motivation" }),
  goals: z.string().min(20, { message: "Please describe your goals" }),
  
  // Business Plan
  strategy: z.string().min(50, { message: "Please provide a detailed strategy" }),
  
  // National Director Agreement
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
  agreeToConfidentiality: z.boolean().refine(val => val === true, {
    message: "You must agree to the confidentiality terms",
  }),
  
  // Personal and Professional Information
  dateOfBirth: z.string().min(2, { message: "Date of birth is required" }),
  bio: z.string().max(2500, { message: "Bio must be 500 words or less" }),
  socialMedia: z.string().min(2, { message: "Social media information is required" }),
  
  // Country Information
  countryOverview: z.string().max(2500, { message: "Country overview must be 500 words or less" }),
  culturalInfo: z.string().max(2500, { message: "Cultural information must be 500 words or less" }),
});

type DirectorFormValues = z.infer<typeof directorFormSchema>;

const DirectorApplicationForm: React.FC<DirectorApplicationFormProps> = ({ 
  onSubmitSuccess,
  onBack 
}) => {
  const [currentSection, setCurrentSection] = useState<
    'contact' | 'background' | 'motivation' | 'business' | 'agreement' | 'profile' | 'country'
  >('contact');
  
  // Initialize the form
  const form = useForm<DirectorFormValues>({
    resolver: zodResolver(directorFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      country: '',
      city: '',
      workExperience: '',
      education: '',
      skills: '',
      motivation: '',
      goals: '',
      strategy: '',
      agreeToTerms: false,
      agreeToConfidentiality: false,
      dateOfBirth: '',
      bio: '',
      socialMedia: '',
      countryOverview: '',
      culturalInfo: '',
    },
    mode: 'onChange',
  });
  
  // Handle form submission
  const onSubmit = (data: DirectorFormValues) => {
    console.log("Form submitted:", data);
    toast.success("Director application submitted successfully!");
    onSubmitSuccess();
  };
  
  // Navigate to the next section
  const goToNextSection = async () => {
    let shouldContinue = false;
    
    // Validate the current section fields
    if (currentSection === 'contact') {
      const result = await form.trigger(['fullName', 'email', 'phone', 'country', 'city']);
      shouldContinue = result;
    } else if (currentSection === 'background') {
      const result = await form.trigger(['workExperience', 'education', 'skills']);
      shouldContinue = result;
    } else if (currentSection === 'motivation') {
      const result = await form.trigger(['motivation', 'goals']);
      shouldContinue = result;
    } else if (currentSection === 'business') {
      const result = await form.trigger(['strategy']);
      shouldContinue = result;
    } else if (currentSection === 'agreement') {
      const result = await form.trigger(['agreeToTerms', 'agreeToConfidentiality']);
      shouldContinue = result;
    } else if (currentSection === 'profile') {
      const result = await form.trigger(['dateOfBirth', 'bio', 'socialMedia']);
      shouldContinue = result;
    }
    
    // If validation passes, move to the next section
    if (shouldContinue) {
      if (currentSection === 'contact') setCurrentSection('background');
      else if (currentSection === 'background') setCurrentSection('motivation');
      else if (currentSection === 'motivation') setCurrentSection('business');
      else if (currentSection === 'business') setCurrentSection('agreement');
      else if (currentSection === 'agreement') setCurrentSection('profile');
      else if (currentSection === 'profile') setCurrentSection('country');
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast.error("Please fix the errors before continuing");
    }
  };
  
  // Navigate to the previous section
  const goToPrevSection = () => {
    if (currentSection === 'background') setCurrentSection('contact');
    else if (currentSection === 'motivation') setCurrentSection('background');
    else if (currentSection === 'business') setCurrentSection('motivation');
    else if (currentSection === 'agreement') setCurrentSection('business');
    else if (currentSection === 'profile') setCurrentSection('agreement');
    else if (currentSection === 'country') setCurrentSection('profile');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 text-bloom-primary">
        National Director Application
      </h1>
      
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="h-2 w-full bg-gray-200 rounded-full mb-2">
          <div 
            className="h-full bg-bloom-gold rounded-full transition-all duration-300"
            style={{ 
              width: 
                currentSection === 'contact' ? '14%' : 
                currentSection === 'background' ? '28%' : 
                currentSection === 'motivation' ? '42%' : 
                currentSection === 'business' ? '56%' : 
                currentSection === 'agreement' ? '70%' : 
                currentSection === 'profile' ? '85%' : '100%' 
            }}
          ></div>
        </div>
        <div className="text-sm text-bloom-muted text-center">
          Step {
            currentSection === 'contact' ? '1' : 
            currentSection === 'background' ? '2' : 
            currentSection === 'motivation' ? '3' : 
            currentSection === 'business' ? '4' : 
            currentSection === 'agreement' ? '5' : 
            currentSection === 'profile' ? '6' : '7'
          } of 7
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Contact Information Section */}
          {currentSection === 'contact' && (
            <>
              <h2 className="text-xl font-semibold text-bloom-primary mb-4">Contact Information</h2>
              
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address*</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          
          {/* Background and Experience Section */}
          {currentSection === 'background' && (
            <>
              <h2 className="text-xl font-semibold text-bloom-primary mb-4">Background and Experience</h2>
              
              <FormField
                control={form.control}
                name="workExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Experience*</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please provide a brief overview of your relevant work experience" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Education and Qualifications*</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What education and qualifications do you hold?" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills*</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What skills do you possess that would be beneficial for this role?" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          
          {/* Motivation and Goals Section */}
          {currentSection === 'motivation' && (
            <>
              <h2 className="text-xl font-semibold text-bloom-primary mb-4">Motivation and Goals</h2>
              
              <FormField
                control={form.control}
                name="motivation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motivation*</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Why do you want to become a National Director for Miss Bloom Global?" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="goals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goals*</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What do you hope to achieve in this role?" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          
          {/* Business Plan Section */}
          {currentSection === 'business' && (
            <>
              <h2 className="text-xl font-semibold text-bloom-primary mb-4">Business Plan</h2>
              
              <FormField
                control={form.control}
                name="strategy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Promotion Strategy*</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please outline your strategy for promoting Miss Bloom Global in your country" 
                        className="min-h-[200px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          
          {/* Agreement Section */}
          {currentSection === 'agreement' && (
            <>
              <h2 className="text-xl font-semibold text-bloom-primary mb-4">National Director Agreement</h2>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium mb-2">Terms and Conditions</h3>
                <p className="text-sm text-bloom-muted mb-4">
                  1. The National Director agrees to promote and represent Miss Bloom Global in their designated country.<br />
                  2. The National Director will adhere to the rules, regulations, and guidelines set forth by Miss Bloom Global.
                </p>
                
                <h3 className="font-medium mb-2">Confidentiality and Non-Disclosure</h3>
                <p className="text-sm text-bloom-muted mb-4">
                  1. The National Director agrees to maintain confidentiality and protect sensitive information related to Miss Bloom Global.
                </p>
                
                <h3 className="font-medium mb-2">Territorial Rights</h3>
                <p className="text-sm text-bloom-muted mb-4">
                  1. The National Director will have exclusive rights to promote Miss Bloom Global in their designated country.
                </p>
                
                <h3 className="font-medium mb-2">Payment Terms</h3>
                <p className="text-sm text-bloom-muted">
                  1. The National Director will receive percentage or amount of revenue generated from their country.
                </p>
              </div>
              
              <FormField
                control={form.control}
                name="agreeToTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I agree to the Terms and Conditions*
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="agreeToConfidentiality"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I agree to maintain confidentiality*
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </>
          )}
          
          {/* Profile Section */}
          {currentSection === 'profile' && (
            <>
              <h2 className="text-xl font-semibold text-bloom-primary mb-4">National Director Profile</h2>
              
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth*</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio (max 500 words)*</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please provide a professional bio" 
                        className="min-h-[200px]"
                        {...field} 
                      />
                    </FormControl>
                    <div className="text-xs text-bloom-muted mt-1">
                      Words: {field.value ? field.value.trim().split(/\s+/).filter(Boolean).length : 0}/500
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="socialMedia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Social Media Handles*</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please provide your social media handles (Instagram, Facebook, LinkedIn, etc.)" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          
          {/* Country Information Section */}
          {currentSection === 'country' && (
            <>
              <h2 className="text-xl font-semibold text-bloom-primary mb-4">Country Information</h2>
              
              <FormField
                control={form.control}
                name="countryOverview"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country Overview (max 500 words)*</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please provide an overview of your country" 
                        className="min-h-[200px]"
                        {...field} 
                      />
                    </FormControl>
                    <div className="text-xs text-bloom-muted mt-1">
                      Words: {field.value ? field.value.trim().split(/\s+/).filter(Boolean).length : 0}/500
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="culturalInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cultural and Custom Information (max 500 words)*</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please provide information about your country's culture and customs" 
                        className="min-h-[200px]"
                        {...field} 
                      />
                    </FormControl>
                    <div className="text-xs text-bloom-muted mt-1">
                      Words: {field.value ? field.value.trim().split(/\s+/).filter(Boolean).length : 0}/500
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="pt-4">
                <Button type="submit" className="w-full bg-bloom-gold text-bloom-primary hover:bg-bloom-gold/80">
                  Submit Application
                </Button>
              </div>
            </>
          )}
          
          {/* Navigation buttons */}
          {currentSection !== 'country' && (
            <div className="flex justify-end pt-4">
              {currentSection !== 'contact' && (
                <Button 
                  type="button"
                  variant="outline"
                  onClick={goToPrevSection}
                  className="mr-2"
                >
                  Previous
                </Button>
              )}
              <Button 
                type="button"
                onClick={goToNextSection}
              >
                Next
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default DirectorApplicationForm;