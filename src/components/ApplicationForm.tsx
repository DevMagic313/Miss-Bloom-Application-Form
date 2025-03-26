
import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, ChevronRight, ChevronLeft, Info, ArrowLeft, Loader2, Upload } from 'lucide-react';
import { validateApplicationForm, ApplicationFormData, countWords, FormError, calculateAge, isAgeInRange } from '@/utils/formUtils';
import { toast } from "sonner";

interface ApplicationFormProps {
  onSubmitSuccess: () => void;
  onBack: () => void;
}

const formSections = [
  { id: 'eligibility', title: 'Eligibility', badge: '1' },
  { id: 'contact', title: 'Contact Information', badge: '2' },
  { id: 'personal', title: 'Personal Details', badge: '3' },
  { id: 'background', title: 'Background & Experience', badge: '4' },
  { id: 'motivation', title: 'Motivation & Goals', badge: '5' },
  { id: 'business', title: 'Business Plan', badge: '6' },
  { id: 'photos', title: 'Photos', badge: '7' },
  { id: 'terms', title: 'Terms & Conditions', badge: '8' },
  { id: 'profile', title: 'Personal Profile', badge: '9' },
  { id: 'countryInfo', title: 'Country Information', badge: '10' },
  { id: 'review', title: 'Review & Submit', badge: '11' },
];

const ApplicationForm: React.FC<ApplicationFormProps> = ({ onSubmitSuccess, onBack }) => {
  const [currentSection, setCurrentSection] = useState('eligibility');
  const [formData, setFormData] = useState<ApplicationFormData>({
    firstName: '',
    middleName: '',
    lastName: '',
    fullName: '',
    email: '',
    phone: '',
    homePhone: '',
    country: '',
    city: '',
    street: '',
    addressLine2: '',
    stateRegion: '',
    zipCode: '',
    experience: '',
    education: '',
    skills: '',
    motivation: '',
    goals: '',
    strategy: '',
    dateOfBirth: '',
    age: '',
    ethnicity: '',
    representCountry: '',
    alternateCountry: '',
    bio: '',
    socialMedia: '',
    height: '',
    weight: '',
    bust: '',
    waist: '',
    hips: '',
    dressSize: '',
    shoeSize: '',
    swimsuitSizeTop: '',
    swimsuitSizeBottom: '',
    schoolAttended: '',
    fieldOfStudy: '',
    highestEducation: '',
    threeWords: '',
    hobbies: '',
    pageantExperience: '',
    charity: '',
    hearAboutUs: '',
    headShot1: null,
    headShot2: null,
    bodyShot1: null,
    bodyShot2: null,
    additionalImage1: null,
    additionalImage2: null,
    countryOverview: '',
    culturalInfo: '',
    isEligible: false,
    hasValidPassport: false,
    canTravel: false,
    isGoodHealth: false,
    willFollowRules: false,
  });
  
  const [errors, setErrors] = useState<FormError[]>([]);
  const [focused, setFocused] = useState<string | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  
  // Reset scroll position when changing sections
  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentSection]);

  // Update full name when first, middle, or last name changes
  useEffect(() => {
    const fullName = [
      formData.firstName,
      formData.middleName,
      formData.lastName
    ].filter(Boolean).join(' ');
    
    setFormData(prev => ({ ...prev, fullName }));
  }, [formData.firstName, formData.middleName, formData.lastName]);

  // Calculate age when date of birth changes
  useEffect(() => {
    if (formData.dateOfBirth) {
      const age = calculateAge(formData.dateOfBirth).toString();
      setFormData(prev => ({ ...prev, age }));
    }
  }, [formData.dateOfBirth]);

  const handleFieldChange = (field: keyof ApplicationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: keyof ApplicationFormData, checked: boolean) => {
    setFormData(prev => ({ ...prev, [field]: checked }));
  };

  const handleFileChange = (field: keyof ApplicationFormData, files: FileList | null) => {
    if (files && files.length > 0) {
      setFormData(prev => ({ ...prev, [field]: files[0] }));
    }
  };

  const getErrorMessage = (field: string): string | undefined => {
    return errors.find(error => error.field === field)?.message;
  };

  const handleNext = () => {
    // Validate current section before proceeding
    const sectionErrors = validateApplicationForm(formData, currentSection);
    
    // Additional eligibility validation
    if (currentSection === 'eligibility' && formData.dateOfBirth) {
      if (!isAgeInRange(formData.dateOfBirth, 18, 35)) {
        sectionErrors.push({ 
          field: 'dateOfBirth', 
          message: 'You must be between 18 and 35 years old to participate' 
        });
      }
    }
    
    setErrors(sectionErrors);
    
    if (sectionErrors.length === 0) {
      const currentIndex = formSections.findIndex(section => section.id === currentSection);
      if (currentIndex < formSections.length - 1) {
        const nextSection = formSections[currentIndex + 1].id;
        setCurrentSection(nextSection);
      }
    }
  };

  const handlePrevious = () => {
    const currentIndex = formSections.findIndex(section => section.id === currentSection);
    if (currentIndex > 0) {
      const prevSection = formSections[currentIndex - 1].id;
      setCurrentSection(prevSection);
    }
  };

  const handleSubmit = () => {
    // Validate all sections before submitting
    let allErrors: FormError[] = [];
    
    formSections.forEach(section => {
      if (section.id !== 'review' && section.id !== 'terms') {
        const sectionErrors = validateApplicationForm(formData, section.id);
        allErrors = [...allErrors, ...sectionErrors];
      }
    });
    
    if (!agreeTerms) {
      allErrors.push({ field: 'terms', message: 'You must agree to the terms and conditions' });
    }
    
    setErrors(allErrors);
    
    if (allErrors.length === 0) {
      setIsSubmitting(true);
      
      // Simulate API call delay
      setTimeout(() => {
        // In a real application, you would make an API call to submit the form data
        setIsSubmitting(false);
        onSubmitSuccess();
        toast.success("Application submitted successfully", {
          description: "We'll review your application and contact you soon."
        });
      }, 2000);
    } else {
      // If there are errors, jump to the first section with errors
      const firstErrorSection = formSections.find(section => 
        allErrors.some(error => validateApplicationForm(formData, section.id).some(e => e.field === error.field))
      );
      
      if (firstErrorSection && firstErrorSection.id !== currentSection) {
        setCurrentSection(firstErrorSection.id);
        toast.error("Please fix the errors before submitting", {
          description: "There are errors in your application that need to be corrected."
        });
      }
    }
  };

  const hasError = (field: string): boolean => {
    return errors.some(error => error.field === field);
  };

  return (
    <div className="w-full max-w-3xl mx-auto pb-10 animate-fade-in" ref={formRef}>
      <div className="flex items-center justify-center mb-8">
        <div className="relative">
          <h1 className="text-3xl font-light text-bloom-primary">
            Miss Bloom <span className="font-medium">Global</span>
          </h1>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-bloom-gold"></div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center text-bloom-muted hover:text-bloom-primary"
          onClick={onBack}
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to payment
        </Button>
        <div className="text-sm text-bloom-muted">
          National Director Application
        </div>
      </div>
      
      {/* Navigation Sections */}
      <div className="hidden md:flex mb-8 overflow-x-auto">
        <div className="flex w-full border rounded-md">
          {formSections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => {
                // Only allow clicking on sections that have been validated
                const currentIndex = formSections.findIndex(s => s.id === currentSection);
                if (index <= currentIndex) {
                  setCurrentSection(section.id);
                }
              }}
              className={`flex-1 py-2 px-4 text-sm font-medium relative ${
                currentSection === section.id
                  ? 'bg-bloom-primary text-white'
                  : index < formSections.findIndex(s => s.id === currentSection)
                  ? 'bg-bloom-accent text-bloom-primary'
                  : 'bg-white text-bloom-muted'
              } ${index === 0 ? 'rounded-l-md' : ''} ${index === formSections.length - 1 ? 'rounded-r-md' : ''}`}
            >
              <div className="flex items-center justify-center">
                <Badge variant="outline" className={`w-5 h-5 flex items-center justify-center mr-2 ${
                  currentSection === section.id
                    ? 'border-white text-white'
                    : index < formSections.findIndex(s => s.id === currentSection)
                    ? 'border-bloom-gold bg-bloom-gold text-white'
                    : 'border-bloom-muted text-bloom-muted'
                }`}>
                  {index < formSections.findIndex(s => s.id === currentSection) ? (
                    <Check size={12} />
                  ) : (
                    section.badge
                  )}
                </Badge>
                <span className="whitespace-nowrap">{section.title}</span>
              </div>
              
              {index < formSections.length - 1 && (
                <div className="absolute top-0 right-0 h-full w-4 flex items-center justify-center">
                  <ChevronRight size={16} className="text-bloom-muted" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className="md:hidden mb-6">
        <select
          value={currentSection}
          onChange={(e) => setCurrentSection(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          {formSections.map((section) => (
            <option key={section.id} value={section.id}>
              {section.title}
            </option>
          ))}
        </select>
      </div>
      
      <Card className="w-full shadow-lg border-0 neo-shadow overflow-hidden animate-slide-up">
        <CardHeader className="space-y-1 pb-4">
          <div className="flex items-center">
            <Badge variant="outline" className="mr-2 bg-bloom-primary text-white border-none">
              {formSections.find(s => s.id === currentSection)?.badge}
            </Badge>
            <CardTitle className="text-xl">{formSections.find(s => s.id === currentSection)?.title}</CardTitle>
          </div>
          <CardDescription>
            {currentSection === 'eligibility' && "Please confirm you meet all eligibility requirements"}
            {currentSection === 'contact' && "Your basic contact information"}
            {currentSection === 'personal' && "Your personal details and measurements"}
            {currentSection === 'background' && "Tell us about your experience and qualifications"}
            {currentSection === 'motivation' && "Why do you want to join Miss Bloom Global?"}
            {currentSection === 'business' && "Your strategy to promote Miss Bloom Global"}
            {currentSection === 'photos' && "Upload your photos for the application"}
            {currentSection === 'terms' && "Review and agree to the terms and conditions"}
            {currentSection === 'profile' && "Personal information for your profile"}
            {currentSection === 'countryInfo' && "Information about your country and culture"}
            {currentSection === 'review' && "Review your application before submitting"}
          </CardDescription>
        </CardHeader>
        
        <Separator />
        
        <CardContent className="space-y-6 pt-6">
          {/* Eligibility Requirements Section */}
          {currentSection === 'eligibility' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-bloom-accent/30 p-4 rounded-md">
                <h3 className="font-medium text-lg mb-4">Eligibility Requirements For Participation</h3>
                
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Must be female</li>
                  <li>Must be between the ages of 18-35 years old on pageant date</li>
                  <li>Must not currently be married or pregnant</li>
                  <li>Must be able to communicate in English</li>
                  <li>Must have never been arrested or convicted of any crime</li>
                  <li>Must have never modeled for any sexually explicit or pornographic materials. Artistic nude is acceptable but must be approved by the organization.</li>
                  <li>Must be in good physical and mental health and have no known current sickness that can be contagious</li>
                  <li>Must be committed to adhere to all the pageant rules and regulations upon acceptance.</li>
                  <li>Must have a valid international passport</li>
                  <li>Must be available to travel</li>
                </ol>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className={`${hasError('dateOfBirth') ? 'text-destructive' : ''}`}>
                  Date of Birth*
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
                  onFocus={() => setFocused('dateOfBirth')}
                  onBlur={() => setFocused(null)}
                  className={`transition-all ${focused === 'dateOfBirth' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''} ${hasError('dateOfBirth') ? 'border-destructive' : ''}`}
                />
                {getErrorMessage('dateOfBirth') && (
                  <p className="text-xs text-destructive">{getErrorMessage('dateOfBirth')}</p>
                )}
              </div>
              
              {formData.dateOfBirth && (
                <div className="text-sm">
                  <span className="font-medium">Your age: </span>
                  <span>{formData.age} years old</span>
                </div>
              )}
              
              <div className="space-y-3 border p-4 rounded-md">
                <p className="font-medium text-sm">Please confirm that you meet the following requirements:</p>
                
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="isEligible" 
                      checked={formData.isEligible}
                      onCheckedChange={(checked) => handleCheckboxChange('isEligible', checked === true)}
                      className={hasError('isEligible') ? 'border-destructive' : ''}
                    />
                    <label htmlFor="isEligible" className="text-sm leading-tight">
                      I confirm that I meet all the eligibility requirements listed above
                    </label>
                  </div>
                  {hasError('isEligible') && (
                    <p className="text-xs text-destructive pl-6">{getErrorMessage('isEligible')}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="hasValidPassport" 
                      checked={formData.hasValidPassport}
                      onCheckedChange={(checked) => handleCheckboxChange('hasValidPassport', checked === true)}
                      className={hasError('hasValidPassport') ? 'border-destructive' : ''}
                    />
                    <label htmlFor="hasValidPassport" className="text-sm leading-tight">
                      I have a valid international passport
                    </label>
                  </div>
                  {hasError('hasValidPassport') && (
                    <p className="text-xs text-destructive pl-6">{getErrorMessage('hasValidPassport')}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="canTravel" 
                      checked={formData.canTravel}
                      onCheckedChange={(checked) => handleCheckboxChange('canTravel', checked === true)}
                      className={hasError('canTravel') ? 'border-destructive' : ''}
                    />
                    <label htmlFor="canTravel" className="text-sm leading-tight">
                      I am available to travel
                    </label>
                  </div>
                  {hasError('canTravel') && (
                    <p className="text-xs text-destructive pl-6">{getErrorMessage('canTravel')}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="isGoodHealth" 
                      checked={formData.isGoodHealth}
                      onCheckedChange={(checked) => handleCheckboxChange('isGoodHealth', checked === true)}
                      className={hasError('isGoodHealth') ? 'border-destructive' : ''}
                    />
                    <label htmlFor="isGoodHealth" className="text-sm leading-tight">
                      I am in good physical and mental health with no known contagious diseases
                    </label>
                  </div>
                  {hasError('isGoodHealth') && (
                    <p className="text-xs text-destructive pl-6">{getErrorMessage('isGoodHealth')}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="willFollowRules" 
                      checked={formData.willFollowRules}
                      onCheckedChange={(checked) => handleCheckboxChange('willFollowRules', checked === true)}
                      className={hasError('willFollowRules') ? 'border-destructive' : ''}
                    />
                    <label htmlFor="willFollowRules" className="text-sm leading-tight">
                      I commit to adhere to all pageant rules and regulations
                    </label>
                  </div>
                  {hasError('willFollowRules') && (
                    <p className="text-xs text-destructive pl-6">{getErrorMessage('willFollowRules')}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Contact Information Section */}
          {currentSection === 'contact' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className={`${hasError('firstName') ? 'text-destructive' : ''}`}>
                    First Name*
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleFieldChange('firstName', e.target.value)}
                    onFocus={() => setFocused('firstName')}
                    onBlur={() => setFocused(null)}
                    className={`transition-all ${focused === 'firstName' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''} ${hasError('firstName') ? 'border-destructive' : ''}`}
                  />
                  {getErrorMessage('firstName') && (
                    <p className="text-xs text-destructive">{getErrorMessage('firstName')}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="middleName">
                    Middle Name
                  </Label>
                  <Input
                    id="middleName"
                    value={formData.middleName}
                    onChange={(e) => handleFieldChange('middleName', e.target.value)}
                    onFocus={() => setFocused('middleName')}
                    onBlur={() => setFocused(null)}
                    className={`transition-all ${focused === 'middleName' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''}`}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName" className={`${hasError('lastName') ? 'text-destructive' : ''}`}>
                  Last Name*
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleFieldChange('lastName', e.target.value)}
                  onFocus={() => setFocused('lastName')}
                  onBlur={() => setFocused(null)}
                  className={`transition-all ${focused === 'lastName' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''} ${hasError('lastName') ? 'border-destructive' : ''}`}
                />
                {getErrorMessage('lastName') && (
                  <p className="text-xs text-destructive">{getErrorMessage('lastName')}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className={`${hasError('email') ? 'text-destructive' : ''}`}>
                  Email Address*
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  className={`transition-all ${focused === 'email' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''} ${hasError('email') ? 'border-destructive' : ''}`}
                />
                {getErrorMessage('email') && (
                  <p className="text-xs text-destructive">{getErrorMessage('email')}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className={`${hasError('phone') ? 'text-destructive' : ''}`}>
                    Cell Phone*
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                    onFocus={() => setFocused('phone')}
                    onBlur={() => setFocused(null)}
                    className={`transition-all ${focused === 'phone' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''} ${hasError('phone') ? 'border-destructive' : ''}`}
                  />
                  {getErrorMessage('phone') && (
                    <p className="text-xs text-destructive">{getErrorMessage('phone')}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="homePhone">
                    Home Phone
                  </Label>
                  <Input
                    id="homePhone"
                    value={formData.homePhone}
                    onChange={(e) => handleFieldChange('homePhone', e.target.value)}
                    onFocus={() => setFocused('homePhone')}
                    onBlur={() => setFocused(null)}
                    className={`transition-all ${focused === 'homePhone' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''}`}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="street">
                  Street Address
                </Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) => handleFieldChange('street', e.target.value)}
                  onFocus={() => setFocused('street')}
                  onBlur={() => setFocused(null)}
                  className={`transition-all ${focused === 'street' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''}`}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="addressLine2">
                  Address Line 2
                </Label>
                <Input
                  id="addressLine2"
                  value={formData.addressLine2}
                  onChange={(e) => handleFieldChange('addressLine2', e.target.value)}
                  onFocus={() => setFocused('addressLine2')}
                  onBlur={() => setFocused(null)}
                  className={`transition-all ${focused === 'addressLine2' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''}`}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className={`${hasError('city') ? 'text-destructive' : ''}`}>
                    City*
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleFieldChange('city', e.target.value)}
                    onFocus={() => setFocused('city')}
                    onBlur={() => setFocused(null)}
                    className={`transition-all ${focused === 'city' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''} ${hasError('city') ? 'border-destructive' : ''}`}
                  />
                  {getErrorMessage('city') && (
                    <p className="text-xs text-destructive">{getErrorMessage('city')}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stateRegion">
                    State / Province / Region
                  </Label>
                  <Input
                    id="stateRegion"
                    value={formData.stateRegion}
                    onChange={(e) => handleFieldChange('stateRegion', e.target.value)}
                    onFocus={() => setFocused('stateRegion')}
                    onBlur={() => setFocused(null)}
                    className={`transition-all ${focused === 'stateRegion' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''}`}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">
                    ZIP / Postal Code
                  </Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleFieldChange('zipCode', e.target.value)}
                    onFocus={() => setFocused('zipCode')}
                    onBlur={() => setFocused(null)}
                    className={`transition-all ${focused === 'zipCode' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''}`}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country" className={`${hasError('country') ? 'text-destructive' : ''}`}>
                    Country*
                  </Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleFieldChange('country', e.target.value)}
                    onFocus={() => setFocused('country')}
                    onBlur={() => setFocused(null)}
                    className={`transition-all ${focused === 'country' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''} ${hasError('country') ? 'border-destructive' : ''}`}
                  />
                  {getErrorMessage('country') && (
                    <p className="text-xs text-destructive">{getErrorMessage('country')}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Personal Details Section */}
          {currentSection === 'personal' && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="ethnicity" className={`${hasError('ethnicity') ? 'text-destructive' : ''}`}>
                  Ethnicity*
                </Label>
                <Input
                  id="ethnicity"
                  value={formData.ethnicity}
                  onChange={(e) => handleFieldChange('ethnicity', e.target.value)}
                  onFocus={() => setFocused('ethnicity')}
                  onBlur={() => setFocused(null)}
                  className={`transition-all ${focused === 'ethnicity' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''} ${hasError('ethnicity') ? 'border-destructive' : ''}`}
                />
                {getErrorMessage('ethnicity') && (
                  <p className="text-xs text-destructive">{getErrorMessage('ethnicity')}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="representCountry" className={`${hasError('representCountry') ? 'text-destructive' : ''}`}>
                    What Country Would You Like to Represent?*
                  </Label>
                  <Input
                    id="representCountry"
                    value={formData.representCountry}
                    onChange={(e) => handleFieldChange('representCountry', e.target.value)}
                    onFocus={() => setFocused('representCountry')}
                    onBlur={() => setFocused(null)}
                    className={`transition-all ${focused === 'representCountry' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''} ${hasError('representCountry') ? 'border-destructive' : ''}`}
                  />
                  {getErrorMessage('representCountry') && (
                    <p className="text-xs text-destructive">{getErrorMessage('representCountry')}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="alternateCountry">
                    What Other Country Would You Like to Represent?
                  </Label>
                  <Input
                    id="alternateCountry"
                    value={formData.alternateCountry}
                    onChange={(e) => handleFieldChange('alternateCountry', e.target.value)}
                    onFocus={() => setFocused('alternateCountry')}
                    onBlur={() => setFocused(null)}
                    className={`transition-all ${focused === 'alternateCountry' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''}`}
                  />
                </div>
              </div>
              
              <h3 className="font-medium text-base mt-4">Measurements</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height" className={`${hasError('height') ? 'text-destructive' : ''}`}>
                    Height*
                  </Label>
                  <Input
                    id="height"
                    value={formData.height}
                    onChange={(e) => handleFieldChange('height', e.target.value)}
                    onFocus={() => setFocused('height')}
                    onBlur={() => setFocused(null)}
                    className={`transition-all ${focused === 'height' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''} ${hasError('height') ? 'border-destructive' : ''}`}
                  />
                  {getErrorMessage('height') && (
                    <p className="text-xs text-destructive">{getErrorMessage('height')}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="weight" className={`${hasError('weight') ? 'text-destructive' : ''}`}>
                    Weight*
                  </Label>
                  <Input
                    id="weight"
                    value={formData.weight}
                    onChange={(e) => handleFieldChange('weight', e.target.value)}
                    onFocus={() => setFocused('weight')}
                    onBlur={() => setFocused(null)}
                    className={`transition-all ${focused === 'weight' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''} ${hasError('weight') ? 'border-destructive' : ''}`}
                  />
                  {getErrorMessage('weight') && (
                    <p className="text-xs text-destructive">{getErrorMessage('weight')}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bust">
                    Bust
                  </Label>
                  <Input
                    id="bust"
                    value={formData.bust}
                    onChange={(e) => handleFieldChange('bust', e.target.value)}
                    onFocus={() => setFocused('bust')}
                    onBlur={() => setFocused(null)}
                    className={`transition-all ${focused === 'bust' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''}`}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="waist">
                    Waist
                  </Label>
                  <Input
                    id="waist"
                    value={formData.waist}
                    onChange={(e) => handleFieldChange('waist', e.target.value)}
                    onFocus={() => setFocused('waist')}
                    onBlur={() => setFocused(null)}
                    className={`transition-all ${focused === 'waist' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''}`}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hips">
                    Hips
                  </Label>
                  <Input
                    id="hips"
                    value={formData.hips}
                    onChange={(e) => handleFieldChange('hips', e.target.value)}
                    onFocus={() => setFocused('hips')}
                    onBlur={() => setFocused(null)}
                    className={`transition-all ${focused === 'hips' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''}`}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dressSize">
                    Dress Size
                  </Label>
                  <Input
                    id="dressSize"
                    value={formData.dressSize}
                    onChange={(e) => handleFieldChange('dressSize', e.target.value)}
                    onFocus={() => setFocused('dressSize')}
                    onBlur={() => setFocused(null)}
                    className={`transition-all ${focused === 'dressSize' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''}`}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shoeSize">
                    Shoe Size
                  </Label>
                  <Input
                    id="shoeSize"
                    value={formData.shoeSize}
                    onChange={(e) => handleFieldChange('shoeSize', e.target.value)}
                    onFocus={() => setFocused('shoeSize')}
                    onBlur={() => setFocused(null)}
                    className={`transition-all ${focused === 'shoeSize' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''}`}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="swimsuitSizeTop">
                    Swimsuit Size Top
                  </Label>
                  <Input
                    id="swimsuitSizeTop"
                    value={formData.swimsuitSizeTop}
                    onChange={(e) => handleFieldChange('swimsuitSizeTop', e.target.value)}
                    onFocus={() => setFocused('swimsuitSizeTop')}
                    onBlur={() => setFocused(null)}
                    className={`transition-all ${focused === 'swimsuitSizeTop' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''}`}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="swimsuitSizeBottom">
                    Swimsuit Size Bottom
                  </Label>
                  <Input
                    id="swimsuitSizeBottom"
                    value={formData.swimsuitSizeBottom}
                    onChange={(e) => handleFieldChange('swimsuitSizeBottom', e.target.value)}
                    onFocus={() => setFocused('swimsuitSizeBottom')}
                    onBlur={() => setFocused(null)}
                    className={`transition-all ${focused === 'swimsuitSizeBottom' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''}`}
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Background & Experience Section */}
          {currentSection === 'background' && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="schoolAttended">
                  School Attended
                </Label>
                <Input
                  id="schoolAttended"
                  value={formData.schoolAttended}
                  onChange={(e) => handleFieldChange('schoolAttended', e.target.value)}
                  onFocus={() => setFocused('schoolAttended')}
                  onBlur={() => setFocused(null)}
                  className={`transition-all ${focused === 'schoolAttended' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''}`}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fieldOfStudy">
                  Field of Study
                </Label>
                <Input
                  id="fieldOfStudy"
                  value={formData.fieldOfStudy}
                  onChange={(e) => handleFieldChange('fieldOfStudy', e.target.value)}
                  onFocus={() => setFocused('fieldOfStudy')}
                  onBlur={() => setFocused(null)}
                  className={`transition-all ${focused === 'fieldOfStudy' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''}`}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="highestEducation">
                  Highest Education Level & Accomplishments
                </Label>
                <Textarea
                  id="highestEducation"
                  value={formData.highestEducation}
                  onChange={(e) => handleFieldChange('highestEducation', e.target.value)}
                  onFocus={() => setFocused('highestEducation')}
                  onBlur={() => setFocused(null)}
                  rows={4}
                  className={`transition-all ${focused === 'highestEducation' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''}`}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience" className={`${hasError('experience') ? 'text-destructive' : ''}`}>
                  Please provide a brief overview of your relevant work experience*
                </Label>
                <Textarea
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => handleFieldChange('experience', e.target.value)}
                  onFocus={() => setFocused('experience')}
                  onBlur={() => setFocused(null)}
                  rows={5}
                  className={`transition-all ${focused === 'experience' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''} ${hasError('experience') ? 'border-destructive' : ''}`}
                />
                {getErrorMessage('experience') && (
                  <p className="text-xs text-destructive">{getErrorMessage('experience')}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="education" className={`${hasError('education') ? 'text-destructive' : ''}`}>
                  What education and qualifications do you hold?*
                </Label>
                <Textarea
                  id="education"
                  value={formData.education}
                  onChange={(e) => handleFieldChange('education', e.target.value)}
                  onFocus={() => setFocused('education')}
                  onBlur={() => setFocused(null)}
                  rows={5}
                  className={`transition-all ${focused === 'education' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''} ${hasError('education') ? 'border-destructive' : ''}`}
                />
                {getErrorMessage('education') && (
                  <p className="text-xs text-destructive">{getErrorMessage('education')}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="skills" className={`${hasError('skills') ? 'text-destructive' : ''}`}>
                  What skills do you possess that would be beneficial for this role?*
                </Label>
                <Textarea
                  id="skills"
                  value={formData.skills}
                  onChange={(e) => handleFieldChange('skills', e.target.value)}
                  onFocus={() => setFocused('skills')}
                  onBlur={() => setFocused(null)}
                  rows={5}
                  className={`transition-all ${focused === 'skills' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''} ${hasError('skills') ? 'border-destructive' : ''}`}
                />
                {getErrorMessage('skills') && (
                  <p className="text-xs text-destructive">{getErrorMessage('skills')}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="threeWords">
                  Three Words that Best Describe You
                </Label>
                <Input
                  id="threeWords"
                  value={formData.threeWords}
                  onChange={(e) => handleFieldChange('threeWords', e.target.value)}
                  onFocus={() => setFocused('threeWords')}
                  onBlur={() => setFocused(null)}
                  className={`transition-all ${focused === 'threeWords' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''}`}
                  placeholder="e.g. Determined, Compassionate, Creative"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hobbies">
                  Hobbies & Talents
                </Label>
                <Textarea
                  id="hobbies"
                  value={formData.hobbies}
                  onChange={(e) => handleFieldChange('hobbies', e.target.value)}
                  onFocus={() => setFocused('hobbies')}
                  onBlur={() => setFocused(null)}
                  rows={4}
                  className={`transition-all ${focused === 'hobbies' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''}`}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pageantExperience">
                  List Previous Pageant or Modeling Experience & Titles Received
                </Label>
                <Textarea
                  id="pageantExperience"
                  value={formData.pageantExperience}
                  onChange={(e) => handleFieldChange('pageantExperience', e.target.value)}
                  onFocus={() => setFocused('pageantExperience')}
                  onBlur={() => setFocused(null)}
                  rows={4}
                  className={`transition-all ${focused === 'pageantExperience' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''}`}
                />
              </div>
            </div>
          )}
          
          {/* Motivation & Goals Section */}
          {currentSection === 'motivation' && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="motivation" className={`${hasError('motivation') ? 'text-destructive' : ''}`}>
                  Why do you want to become a National Director for Miss Bloom Global?*
                </Label>
                <Textarea
                  id="motivation"
                  value={formData.motivation}
                  onChange={(e) => handleFieldChange('motivation', e.target.value)}
                  onFocus={() => setFocused('motivation')}
                  onBlur={() => setFocused(null)}
                  rows={5}
                  className={`transition-all ${focused === 'motivation' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''} ${hasError('motivation') ? 'border-destructive' : ''}`}
                />
                {getErrorMessage('motivation') && (
                  <p className="text-xs text-destructive">{getErrorMessage('motivation')}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="goals" className={`${hasError('goals') ? 'text-destructive' : ''}`}>
                  What do you hope to achieve in this role?*
                </Label>
                <Textarea
                  id="goals"
                  value={formData.goals}
                  onChange={(e) => handleFieldChange('goals', e.target.value)}
                  onFocus={() => setFocused('goals')}
                  onBlur={() => setFocused(null)}
                  rows={5}
                  className={`transition-all ${focused === 'goals' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''} ${hasError('goals') ? 'border-destructive' : ''}`}
                />
                {getErrorMessage('goals') && (
                  <p className="text-xs text-destructive">{getErrorMessage('goals')}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="charity">
                  What charity/cause you would like to support & why?
                </Label>
                <Textarea
                  id="charity"
                  value={formData.charity}
                  onChange={(e) => handleFieldChange('charity', e.target.value)}
                  onFocus={() => setFocused('charity')}
                  onBlur={() => setFocused(null)}
                  rows={4}
                  className={`transition-all ${focused === 'charity' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''}`}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hearAboutUs">
                  How Did You Hear About Us?*
                </Label>
                <Input
                  id="hearAboutUs"
                  value={formData.hearAboutUs}
                  onChange={(e) => handleFieldChange('hearAboutUs', e.target.value)}
                  onFocus={() => setFocused('hearAboutUs')}
                  onBlur={() => setFocused(null)}
                  className={`transition-all ${focused === 'hearAboutUs' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''}`}
                />
              </div>
            </div>
          )}
          
          {/* Business Plan Section */}
          {currentSection === 'business' && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="strategy" className={`${hasError('strategy') ? 'text-destructive' : ''}`}>
                  Please outline your strategy for promoting Miss Bloom Global in your country*
                </Label>
                <Textarea
                  id="strategy"
                  value={formData.strategy}
                  onChange={(e) => handleFieldChange('strategy', e.target.value)}
                  onFocus={() => setFocused('strategy')}
                  onBlur={() => setFocused(null)}
                  rows={8}
                  className={`transition-all ${focused === 'strategy' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''} ${hasError('strategy') ? 'border-destructive' : ''}`}
                />
                {getErrorMessage('strategy') && (
                  <p className="text-xs text-destructive">{getErrorMessage('strategy')}</p>
                )}
              </div>
            </div>
          )}
          
          {/* Photos Section */}
          {currentSection === 'photos' && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="headShot1" className={`${hasError('headShot1') ? 'text-destructive' : ''}`}>
                  Head Shot #1*
                </Label>
                <div className="flex items-center justify-center border border-dashed rounded-md h-32 relative">
                  <Input
                    id="headShot1"
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => handleFileChange('headShot1', e.target.files)}
                  />
                  <div className="text-center">
                    <Upload className="mx-auto h-10 w-10 text-gray-400" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">Max. file size: 100 MB</p>
                  </div>
                </div>
                {formData.headShot1 && (
                  <p className="text-xs text-green-600">{formData.headShot1.name} selected</p>
                )}
                {getErrorMessage('headShot1') && (
                  <p className="text-xs text-destructive">{getErrorMessage('headShot1')}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="headShot2" className={`${hasError('headShot2') ? 'text-destructive' : ''}`}>
                  Head Shot #2*
                </Label>
                <div className="flex items-center justify-center border border-dashed rounded-md h-32 relative">
                  <Input
                    id="headShot2"
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => handleFileChange('headShot2', e.target.files)}
                  />
                  <div className="text-center">
                    <Upload className="mx-auto h-10 w-10 text-gray-400" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">Max. file size: 100 MB</p>
                  </div>
                </div>
                {formData.headShot2 && (
                  <p className="text-xs text-green-600">{formData.headShot2.name} selected</p>
                )}
                {getErrorMessage('headShot2') && (
                  <p className="text-xs text-destructive">{getErrorMessage('headShot2')}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bodyShot1" className={`${hasError('bodyShot1') ? 'text-destructive' : ''}`}>
                  Body Shot #1*
                </Label>
                <div className="flex items-center justify-center border border-dashed rounded-md h-32 relative">
                  <Input
                    id="bodyShot1"
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => handleFileChange('bodyShot1', e.target.files)}
                  />
                  <div className="text-center">
                    <Upload className="mx-auto h-10 w-10 text-gray-400" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">Max. file size: 100 MB</p>
                  </div>
                </div>
                {formData.bodyShot1 && (
                  <p className="text-xs text-green-600">{formData.bodyShot1.name} selected</p>
                )}
                {getErrorMessage('bodyShot1') && (
                  <p className="text-xs text-destructive">{getErrorMessage('bodyShot1')}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bodyShot2" className={`${hasError('bodyShot2') ? 'text-destructive' : ''}`}>
                  Body Shot #2*
                </Label>
                <div className="flex items-center justify-center border border-dashed rounded-md h-32 relative">
                  <Input
                    id="bodyShot2"
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => handleFileChange('bodyShot2', e.target.files)}
                  />
                  <div className="text-center">
                    <Upload className="mx-auto h-10 w-10 text-gray-400" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">Max. file size: 100 MB</p>
                  </div>
                </div>
                {formData.bodyShot2 && (
                  <p className="text-xs text-green-600">{formData.bodyShot2.name} selected</p>
                )}
                {getErrorMessage('bodyShot2') && (
                  <p className="text-xs text-destructive">{getErrorMessage('bodyShot2')}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="additionalImage1">
                  Additional Image #1
                </Label>
                <div className="flex items-center justify-center border border-dashed rounded-md h-32 relative">
                  <Input
                    id="additionalImage1"
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => handleFileChange('additionalImage1', e.target.files)}
                  />
                  <div className="text-center">
                    <Upload className="mx-auto h-10 w-10 text-gray-400" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">Max. file size: 100 MB</p>
                  </div>
                </div>
                {formData.additionalImage1 && (
                  <p className="text-xs text-green-600">{formData.additionalImage1.name} selected</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="additionalImage2">
                  Additional Image #2
                </Label>
                <div className="flex items-center justify-center border border-dashed rounded-md h-32 relative">
                  <Input
                    id="additionalImage2"
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => handleFileChange('additionalImage2', e.target.files)}
                  />
                  <div className="text-center">
                    <Upload className="mx-auto h-10 w-10 text-gray-400" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">Max. file size: 100 MB</p>
                  </div>
                </div>
                {formData.additionalImage2 && (
                  <p className="text-xs text-green-600">{formData.additionalImage2.name} selected</p>
                )}
              </div>
            </div>
          )}
          
          {/* Terms & Conditions Section */}
          {currentSection === 'terms' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-bloom-accent/30 p-4 rounded-md">
                <h3 className="font-medium text-lg mb-4">National Director Agreement</h3>
                
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Terms and Conditions</h4>
                  <ol className="list-decimal pl-5 space-y-2 text-sm">
                    <li>The National Director agrees to promote and represent Miss Bloom Global in their designated country.</li>
                    <li>The National Director will adhere to the rules, regulations, and guidelines set forth by Miss Bloom Global.</li>
                  </ol>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Confidentiality and Non-Disclosure</h4>
                  <ol className="list-decimal pl-5 space-y-2 text-sm">
                    <li>The National Director agrees to maintain confidentiality and protect sensitive information related to Miss Bloom Global.</li>
                  </ol>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Territorial Rights</h4>
                  <ol className="list-decimal pl-5 space-y-2 text-sm">
                    <li>The National Director will have exclusive rights to promote Miss Bloom Global in their designated country.</li>
                  </ol>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Payment Terms</h4>
                  <ol className="list-decimal pl-5 space-y-2 text-sm">
                    <li>The National Director will receive percentage or amount of revenue generated from their country.</li>
                  </ol>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <div className="pt-0.5">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    checked={agreeTerms}
                    onChange={() => setAgreeTerms(!agreeTerms)}
                    className="h-4 w-4 rounded border-gray-300 text-bloom-primary focus:ring-bloom-gold/20"
                  />
                </div>
                <label htmlFor="agreeTerms" className="text-sm">
                  I have read and agree to the terms and conditions above*
                </label>
              </div>
              {hasError('terms') && (
                <p className="text-xs text-destructive">{getErrorMessage('terms')}</p>
              )}
            </div>
          )}
          
          {/* Personal Profile Section */}
          {currentSection === 'profile' && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className={`${hasError('dateOfBirth') ? 'text-destructive' : ''}`}>
                  Date of Birth*
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
                  onFocus={() => setFocused('dateOfBirth')}
                  onBlur={() => setFocused(null)}
                  className={`transition-all ${focused === 'dateOfBirth' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''} ${hasError('dateOfBirth') ? 'border-destructive' : ''}`}
                />
                {getErrorMessage('dateOfBirth') && (
                  <p className="text-xs text-destructive">{getErrorMessage('dateOfBirth')}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="bio" className={`${hasError('bio') ? 'text-destructive' : ''}`}>
                    Bio (max 500 words)*
                  </Label>
                  <span className="text-xs text-bloom-muted">
                    {countWords(formData.bio)}/500 words
                  </span>
                </div>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleFieldChange('bio', e.target.value)}
                  onFocus={() => setFocused('bio')}
                  onBlur={() => setFocused(null)}
                  rows={8}
                  className={`transition-all ${focused === 'bio' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''} ${hasError('bio') ? 'border-destructive' : ''}`}
                />
                {getErrorMessage('bio') && (
                  <p className="text-xs text-destructive">{getErrorMessage('bio')}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="socialMedia" className={`${hasError('socialMedia') ? 'text-destructive' : ''}`}>
                  Social Media Handles*
                </Label>
                <Textarea
                  id="socialMedia"
                  value={formData.socialMedia}
                  onChange={(e) => handleFieldChange('socialMedia', e.target.value)}
                  onFocus={() => setFocused('socialMedia')}
                  onBlur={() => setFocused(null)}
                  rows={4}
                  placeholder="Instagram: @username&#10;Facebook: facebook.com/username&#10;LinkedIn: linkedin.com/in/username"
                  className={`transition-all ${focused === 'socialMedia' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''} ${hasError('socialMedia') ? 'border-destructive' : ''}`}
                />
                {getErrorMessage('socialMedia') && (
                  <p className="text-xs text-destructive">{getErrorMessage('socialMedia')}</p>
                )}
              </div>
            </div>
          )}
          
          {/* Country Information Section */}
          {currentSection === 'countryInfo' && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="countryOverview" className={`${hasError('countryOverview') ? 'text-destructive' : ''}`}>
                    Country Overview (max 500 words)*
                  </Label>
                  <span className="text-xs text-bloom-muted">
                    {countWords(formData.countryOverview)}/500 words
                  </span>
                </div>
                <Textarea
                  id="countryOverview"
                  value={formData.countryOverview}
                  onChange={(e) => handleFieldChange('countryOverview', e.target.value)}
                  onFocus={() => setFocused('countryOverview')}
                  onBlur={() => setFocused(null)}
                  rows={8}
                  className={`transition-all ${focused === 'countryOverview' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''} ${hasError('countryOverview') ? 'border-destructive' : ''}`}
                />
                {getErrorMessage('countryOverview') && (
                  <p className="text-xs text-destructive">{getErrorMessage('countryOverview')}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="culturalInfo" className={`${hasError('culturalInfo') ? 'text-destructive' : ''}`}>
                    Cultural and Custom Information (max 500 words)*
                  </Label>
                  <span className="text-xs text-bloom-muted">
                    {countWords(formData.culturalInfo)}/500 words
                  </span>
                </div>
                <Textarea
                  id="culturalInfo"
                  value={formData.culturalInfo}
                  onChange={(e) => handleFieldChange('culturalInfo', e.target.value)}
                  onFocus={() => setFocused('culturalInfo')}
                  onBlur={() => setFocused(null)}
                  rows={8}
                  className={`transition-all ${focused === 'culturalInfo' ? 'border-bloom-gold ring-1 ring-bloom-gold/20' : ''} ${hasError('culturalInfo') ? 'border-destructive' : ''}`}
                />
                {getErrorMessage('culturalInfo') && (
                  <p className="text-xs text-destructive">{getErrorMessage('culturalInfo')}</p>
                )}
              </div>
            </div>
          )}
          
          {/* Review & Submit Section */}
          {currentSection === 'review' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-bloom-accent/30 p-4 rounded-md">
                <h3 className="font-medium text-lg mb-4 flex items-center">
                  <Info size={16} className="mr-2 text-bloom-muted" />
                  Review Your Application
                </h3>
                <p className="text-sm text-bloom-muted mb-4">
                  Please review your information below before submitting your application. You can go back to any section to make changes if needed.
                </p>
                
                <Tabs defaultValue="contact" className="w-full">
                  <TabsList className="grid grid-cols-2 mb-4 md:grid-cols-4">
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                    <TabsTrigger value="background">Background</TabsTrigger>
                    <TabsTrigger value="motivation">Motivation</TabsTrigger>
                    <TabsTrigger value="other">Other Details</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="contact" className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium">Full Name</h4>
                      <p className="text-sm">{formData.fullName || 'Not provided'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Email</h4>
                      <p className="text-sm">{formData.email || 'Not provided'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Phone</h4>
                      <p className="text-sm">{formData.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Country</h4>
                      <p className="text-sm">{formData.country || 'Not provided'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">City</h4>
                      <p className="text-sm">{formData.city || 'Not provided'}</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="background" className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium">Experience</h4>
                      <p className="text-sm whitespace-pre-line">{formData.experience || 'Not provided'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Education</h4>
                      <p className="text-sm whitespace-pre-line">{formData.education || 'Not provided'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Skills</h4>
                      <p className="text-sm whitespace-pre-line">{formData.skills || 'Not provided'}</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="motivation" className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium">Motivation</h4>
                      <p className="text-sm whitespace-pre-line">{formData.motivation || 'Not provided'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Goals</h4>
                      <p className="text-sm whitespace-pre-line">{formData.goals || 'Not provided'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Business Strategy</h4>
                      <p className="text-sm whitespace-pre-line">{formData.strategy || 'Not provided'}</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="other" className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium">Date of Birth</h4>
                      <p className="text-sm">{formData.dateOfBirth || 'Not provided'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Bio</h4>
                      <p className="text-sm whitespace-pre-line">{formData.bio || 'Not provided'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Social Media</h4>
                      <p className="text-sm whitespace-pre-line">{formData.socialMedia || 'Not provided'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Terms & Conditions</h4>
                      <p className="text-sm">{agreeTerms ? 'Agreed' : 'Not agreed'}</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between pt-4">
          {currentSection !== 'eligibility' ? (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              className="flex items-center"
            >
              <ChevronLeft size={16} className="mr-1" />
              Previous
            </Button>
          ) : (
            <div></div>
          )}
          
          {currentSection !== 'review' ? (
            <Button
              type="button"
              onClick={handleNext}
              className="bg-bloom-primary hover:bg-bloom-primary/90 hover-lift"
            >
              Next
              <ChevronRight size={16} className="ml-1" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-bloom-primary hover:bg-bloom-primary/90 hover-lift"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Submitting...
                </div>
              ) : (
                "Submit Application"
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ApplicationForm;