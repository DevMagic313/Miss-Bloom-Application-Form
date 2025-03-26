import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Lock, Calendar, ShieldCheck, Wallet, Building, AlertCircle, CheckCircle, Crown } from 'lucide-react';
import { validatePaymentForm, formatCardNumber, formatExpiryDate, FormError } from '@/utils/formUtils';

interface PaymentFormProps {
  onPaymentSuccess: () => void;
  onBack: () => void; // Keep this prop for type compatibility, even if we don't use it
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onPaymentSuccess, onBack }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'bank'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCVV] = useState('');
  const [name, setName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<FormError[]>([]);
  const [focused, setFocused] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>('250');

  const getErrorMessage = (field: string): string | undefined => {
    return errors.find(error => error.field === field)?.message;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 16);
    setCardNumber(formatCardNumber(value));
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d/]/g, '');
    if (value.length <= 5) {
      setExpiryDate(formatExpiryDate(value));
    }
  };

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setCVV(value);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and decimal point
    const value = e.target.value.replace(/[^\d.]/g, '');
    
    // Validate format (optional decimal with max 2 decimal places)
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate amount
    const amountErrors: FormError[] = [];
    const numAmount = parseFloat(amount);
    
    if (!amount.trim()) {
      amountErrors.push({ field: 'amount', message: 'Amount is required' });
    } else if (isNaN(numAmount) || numAmount <= 0) {
      amountErrors.push({ field: 'amount', message: 'Please enter a valid amount greater than 0' });
    }
    
    if (amountErrors.length > 0) {
      setErrors(amountErrors);
      return;
    }
    
    if (paymentMethod === 'card') {
      const paymentData = {
        cardNumber,
        expiryDate, 
        cvv,
        name
      };
      
      const validationErrors = validatePaymentForm(paymentData);
      setErrors([...amountErrors, ...validationErrors]);
      
      if (validationErrors.length === 0 && amountErrors.length === 0) {
        processPayment();
      }
    } else if (paymentMethod === 'paypal') {
      // Simple validation for PayPal
      if (!emailAddress.trim()) {
        setErrors([...amountErrors, { field: 'emailAddress', message: 'Email address is required' }]);
        return;
      }
      processPayment();
    } else if (paymentMethod === 'bank') {
      // Simple validation for bank transfer
      const bankErrors: FormError[] = [];
      if (!bankName.trim()) bankErrors.push({ field: 'bankName', message: 'Bank name is required' });
      if (!accountNumber.trim()) bankErrors.push({ field: 'accountNumber', message: 'Account number is required' });
      if (!routingNumber.trim()) bankErrors.push({ field: 'routingNumber', message: 'Routing number is required' });
      
      setErrors([...amountErrors, ...bankErrors]);
      
      if (bankErrors.length === 0 && amountErrors.length === 0) {
        processPayment();
      }
    }
  };

  const processPayment = () => {
    // Simulate API call delay
    setIsProcessing(true);
    setTimeout(() => {
      // In a real application, you would make an API call to your payment processor here
      setIsProcessing(false);
      onPaymentSuccess();
    }, 2000);
  };

  const hasError = (field: string): boolean => {
    return errors.some(error => error.field === field);
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in animate-slide-up">
      <div className="flex flex-col items-center justify-center mb-8 space-y-3">
        <div className="relative">
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <Crown size={24} className="text-bloom-gold animate-float" />
          </div>
          <h1 className="text-3xl font-light text-bloom-primary">
            Miss Bloom <span className="font-medium">Global</span>
          </h1>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-bloom-gold/30 via-bloom-gold to-bloom-gold/30"></div>
        </div>
        <p className="text-sm text-bloom-muted max-w-xs text-center">
          Complete your payment to finalize your application
        </p>
      </div>
      
      <Card className="w-full shadow-lg border-0 neo-shadow overflow-hidden transform transition-all hover:shadow-xl hover-lift">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-bloom-gold/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-bloom-gold/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <CardHeader className="space-y-1 pb-4 relative z-10">
          <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-bloom-gold/30 via-bloom-gold to-bloom-gold/30"></div>
          <CardTitle className="text-xl text-center font-medium">Application Payment</CardTitle>
          <CardDescription className="text-center">
            Complete your payment to submit your application
          </CardDescription>
        </CardHeader>
        
        <Separator />
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6 relative z-10">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-1 text-sm text-bloom-muted">
                <Lock size={14} className="text-bloom-gold" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-5 bg-[#1434CB] rounded-sm transform transition-transform hover:scale-105"></div>
                <div className="w-8 h-5 bg-gradient-to-r from-[#FF5F00] via-[#FF5F00] to-[#FF5F00] rounded-sm transform transition-transform hover:scale-105"></div>
                <div className="w-8 h-5 bg-[#000000] rounded-sm transform transition-transform hover:scale-105"></div>
                <div className="w-8 h-5 bg-[#253B80] rounded-sm transform transition-transform hover:scale-105"></div>
              </div>
            </div>

            <div className="space-y-2 group">
              <div className="flex items-center justify-between">
                <Label htmlFor="amount" className={`text-sm font-medium group-hover:text-bloom-gold transition-colors duration-200 ${hasError('amount') ? 'text-destructive' : ''}`}>
                  Payment Amount
                </Label>
                <span className="text-xs text-bloom-muted">USD</span>
              </div>
              <div className="relative overflow-hidden rounded-md group">
                <Input 
                  id="amount" 
                  value={amount}
                  onChange={handleAmountChange}
                  onFocus={() => setFocused('amount')}
                  onBlur={() => setFocused(null)}
                  className={`pl-8 transition-all duration-300 ${
                    focused === 'amount' 
                      ? 'border-bloom-gold ring-1 ring-bloom-gold/20 shadow-[0_0_0_4px_rgba(220,174,103,0.1)]' 
                      : ''
                  } ${
                    hasError('amount') 
                      ? 'border-destructive' 
                      : 'group-hover:border-bloom-gold/50'
                  }`}
                  placeholder="Enter payment amount"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-bloom-muted group-hover:text-bloom-gold transition-colors duration-200">
                  $
                </div>
                <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full bg-bloom-gold transition-all duration-700 opacity-70"></div>
              </div>
              {getErrorMessage('amount') && (
                <p className="text-xs text-destructive flex items-center gap-1 animate-fade-in">
                  <AlertCircle size={12} />
                  {getErrorMessage('amount')}
                </p>
              )}
              <p className="text-xs text-bloom-muted mt-1">
                Application fee for National Director position
              </p>
            </div>

            <Tabs defaultValue="card" className="w-full" onValueChange={(value) => setPaymentMethod(value as 'card' | 'paypal' | 'bank')}>
              <TabsList className="grid grid-cols-3 mb-6 bg-bloom-accent/50 border border-bloom-gold/10">
                <TabsTrigger value="card" className="flex items-center justify-center gap-1 data-[state=active]:text-bloom-gold data-[state=active]:shadow-[0_-2px_0_0_#DCAE67_inset]">
                  <CreditCard size={16} />
                  <span>Card</span>
                </TabsTrigger>
                <TabsTrigger value="paypal" className="flex items-center justify-center gap-1 data-[state=active]:text-bloom-gold data-[state=active]:shadow-[0_-2px_0_0_#DCAE67_inset]">
                  <Wallet size={16} />
                  <span>PayPal</span>
                </TabsTrigger>
                <TabsTrigger value="bank" className="flex items-center justify-center gap-1 data-[state=active]:text-bloom-gold data-[state=active]:shadow-[0_-2px_0_0_#DCAE67_inset]">
                  <Building size={16} />
                  <span>Bank</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="card" className="space-y-4 animate-fade-in">
                <div className="space-y-2 group">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="card-number" className={`text-sm font-medium group-hover:text-bloom-gold transition-colors duration-200 ${hasError('cardNumber') ? 'text-destructive' : ''}`}>
                      Card Number
                    </Label>
                    <CreditCard size={16} className="text-bloom-muted group-hover:text-bloom-gold transition-colors duration-200" />
                  </div>
                  <div className="relative overflow-hidden rounded-md">
                    <Input
                      id="card-number"
                      placeholder="4242 4242 4242 4242"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      onFocus={() => setFocused('cardNumber')}
                      onBlur={() => setFocused(null)}
                      className={`transition-all duration-300 ${
                        focused === 'cardNumber' 
                          ? 'border-bloom-gold ring-1 ring-bloom-gold/20 shadow-[0_0_0_4px_rgba(220,174,103,0.1)]' 
                          : ''
                      } ${
                        hasError('cardNumber') 
                          ? 'border-destructive' 
                          : 'group-hover:border-bloom-gold/50'
                      }`}
                    />
                    <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full bg-bloom-gold transition-all duration-700 opacity-70"></div>
                  </div>
                  {getErrorMessage('cardNumber') && (
                    <p className="text-xs text-destructive flex items-center gap-1 animate-fade-in">
                      <AlertCircle size={12} />
                      {getErrorMessage('cardNumber')}
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 group">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="expiry" className={`text-sm font-medium group-hover:text-bloom-gold transition-colors duration-200 ${hasError('expiryDate') ? 'text-destructive' : ''}`}>
                        Expiry Date
                      </Label>
                      <Calendar size={16} className="text-bloom-muted group-hover:text-bloom-gold transition-colors duration-200" />
                    </div>
                    <div className="relative overflow-hidden rounded-md">
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={handleExpiryDateChange}
                        onFocus={() => setFocused('expiryDate')}
                        onBlur={() => setFocused(null)}
                        className={`transition-all duration-300 ${
                          focused === 'expiryDate' 
                            ? 'border-bloom-gold ring-1 ring-bloom-gold/20 shadow-[0_0_0_4px_rgba(220,174,103,0.1)]' 
                            : ''
                        } ${
                          hasError('expiryDate') 
                            ? 'border-destructive' 
                            : 'group-hover:border-bloom-gold/50'
                        }`}
                      />
                      <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full bg-bloom-gold transition-all duration-700 opacity-70"></div>
                    </div>
                    {getErrorMessage('expiryDate') && (
                      <p className="text-xs text-destructive flex items-center gap-1 animate-fade-in">
                        <AlertCircle size={12} />
                        {getErrorMessage('expiryDate')}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2 group">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="cvv" className={`text-sm font-medium group-hover:text-bloom-gold transition-colors duration-200 ${hasError('cvv') ? 'text-destructive' : ''}`}>
                        CVV
                      </Label>
                      <ShieldCheck size={16} className="text-bloom-muted group-hover:text-bloom-gold transition-colors duration-200" />
                    </div>
                    <div className="relative overflow-hidden rounded-md">
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={cvv}
                        onChange={handleCVVChange}
                        onFocus={() => setFocused('cvv')}
                        onBlur={() => setFocused(null)}
                        className={`transition-all duration-300 ${
                          focused === 'cvv' 
                            ? 'border-bloom-gold ring-1 ring-bloom-gold/20 shadow-[0_0_0_4px_rgba(220,174,103,0.1)]' 
                            : ''
                        } ${
                          hasError('cvv') 
                            ? 'border-destructive' 
                            : 'group-hover:border-bloom-gold/50'
                        }`}
                      />
                      <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full bg-bloom-gold transition-all duration-700 opacity-70"></div>
                    </div>
                    {getErrorMessage('cvv') && (
                      <p className="text-xs text-destructive flex items-center gap-1 animate-fade-in">
                        <AlertCircle size={12} />
                        {getErrorMessage('cvv')}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2 group">
                  <Label htmlFor="name" className={`text-sm font-medium group-hover:text-bloom-gold transition-colors duration-200 ${hasError('name') ? 'text-destructive' : ''}`}>
                    Cardholder Name
                  </Label>
                  <div className="relative overflow-hidden rounded-md">
                    <Input
                      id="name"
                      placeholder="John Smith"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setFocused('name')}
                      onBlur={() => setFocused(null)}
                      className={`transition-all duration-300 ${
                        focused === 'name' 
                          ? 'border-bloom-gold ring-1 ring-bloom-gold/20 shadow-[0_0_0_4px_rgba(220,174,103,0.1)]' 
                          : ''
                      } ${
                        hasError('name') 
                          ? 'border-destructive' 
                          : 'group-hover:border-bloom-gold/50'
                      }`}
                    />
                    <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full bg-bloom-gold transition-all duration-700 opacity-70"></div>
                  </div>
                  {getErrorMessage('name') && (
                    <p className="text-xs text-destructive flex items-center gap-1 animate-fade-in">
                      <AlertCircle size={12} />
                      {getErrorMessage('name')}
                    </p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="paypal" className="space-y-4 animate-fade-in">
                <div className="flex items-center p-4 bg-blue-50 rounded-md mb-4 border border-blue-100">
                  <div className="bg-blue-100 rounded-full p-1.5 mr-3">
                    <AlertCircle size={16} className="text-blue-500" />
                  </div>
                  <p className="text-sm text-blue-700">
                    You'll be redirected to PayPal to complete your payment securely.
                  </p>
                </div>
                
                <div className="space-y-2 group">
                  <Label htmlFor="email" className={`text-sm font-medium group-hover:text-bloom-gold transition-colors duration-200 ${hasError('emailAddress') ? 'text-destructive' : ''}`}>
                    PayPal Email Address
                  </Label>
                  <div className="relative overflow-hidden rounded-md">
                    <Input
                      id="email"
                      type="email"
                      placeholder="your-email@example.com"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      onFocus={() => setFocused('emailAddress')}
                      onBlur={() => setFocused(null)}
                      className={`transition-all duration-300 ${
                        focused === 'emailAddress' 
                          ? 'border-bloom-gold ring-1 ring-bloom-gold/20 shadow-[0_0_0_4px_rgba(220,174,103,0.1)]' 
                          : ''
                      } ${
                        hasError('emailAddress') 
                          ? 'border-destructive' 
                          : 'group-hover:border-bloom-gold/50'
                      }`}
                    />
                    <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full bg-bloom-gold transition-all duration-700 opacity-70"></div>
                  </div>
                  {getErrorMessage('emailAddress') && (
                    <p className="text-xs text-destructive flex items-center gap-1 animate-fade-in">
                      <AlertCircle size={12} />
                      {getErrorMessage('emailAddress')}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center p-3 bg-blue-50/50 rounded-md border border-blue-100/50">
                  <div className="bg-white rounded-full p-1 mr-3 shadow-sm">
                    <img src="https://cdn.cdnlogo.com/logos/p/19/paypal.svg" alt="PayPal" className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-blue-700">
                    PayPal provides an extra layer of security for your transactions
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="bank" className="space-y-4 animate-fade-in">
                <div className="flex items-center p-4 bg-amber-50 rounded-md mb-4 border border-amber-100">
                  <div className="bg-amber-100 rounded-full p-1.5 mr-3">
                    <AlertCircle size={16} className="text-amber-500" />
                  </div>
                  <p className="text-sm text-amber-700">
                    Bank transfers may take 1-3 business days to process.
                  </p>
                </div>
                
                <div className="space-y-2 group">
                  <Label htmlFor="bank-name" className={`text-sm font-medium group-hover:text-bloom-gold transition-colors duration-200 ${hasError('bankName') ? 'text-destructive' : ''}`}>
                    Bank Name
                  </Label>
                  <div className="relative overflow-hidden rounded-md">
                    <Input
                      id="bank-name"
                      placeholder="Enter your bank name"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      onFocus={() => setFocused('bankName')}
                      onBlur={() => setFocused(null)}
                      className={`transition-all duration-300 ${
                        focused === 'bankName' 
                          ? 'border-bloom-gold ring-1 ring-bloom-gold/20 shadow-[0_0_0_4px_rgba(220,174,103,0.1)]' 
                          : ''
                      } ${
                        hasError('bankName') 
                          ? 'border-destructive' 
                          : 'group-hover:border-bloom-gold/50'
                      }`}
                    />
                    <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full bg-bloom-gold transition-all duration-700 opacity-70"></div>
                  </div>
                  {getErrorMessage('bankName') && (
                    <p className="text-xs text-destructive flex items-center gap-1 animate-fade-in">
                      <AlertCircle size={12} />
                      {getErrorMessage('bankName')}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2 group">
                  <Label htmlFor="account-number" className={`text-sm font-medium group-hover:text-bloom-gold transition-colors duration-200 ${hasError('accountNumber') ? 'text-destructive' : ''}`}>
                    Account Number
                  </Label>
                  <div className="relative overflow-hidden rounded-md">
                    <Input
                      id="account-number"
                      placeholder="Enter your account number"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      onFocus={() => setFocused('accountNumber')}
                      onBlur={() => setFocused(null)}
                      className={`transition-all duration-300 ${
                        focused === 'accountNumber' 
                          ? 'border-bloom-gold ring-1 ring-bloom-gold/20 shadow-[0_0_0_4px_rgba(220,174,103,0.1)]' 
                          : ''
                      } ${
                        hasError('accountNumber') 
                          ? 'border-destructive' 
                          : 'group-hover:border-bloom-gold/50'
                      }`}
                    />
                    <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full bg-bloom-gold transition-all duration-700 opacity-70"></div>
                  </div>
                  {getErrorMessage('accountNumber') && (
                    <p className="text-xs text-destructive flex items-center gap-1 animate-fade-in">
                      <AlertCircle size={12} />
                      {getErrorMessage('accountNumber')}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2 group">
                  <Label htmlFor="routing-number" className={`text-sm font-medium group-hover:text-bloom-gold transition-colors duration-200 ${hasError('routingNumber') ? 'text-destructive' : ''}`}>
                    Routing Number
                  </Label>
                  <div className="relative overflow-hidden rounded-md">
                    <Input
                      id="routing-number"
                      placeholder="Enter your routing number"
                      value={routingNumber}
                      onChange={(e) => setRoutingNumber(e.target.value)}
                      onFocus={() => setFocused('routingNumber')}
                      onBlur={() => setFocused(null)}
                      className={`transition-all duration-300 ${
                        focused === 'routingNumber' 
                          ? 'border-bloom-gold ring-1 ring-bloom-gold/20 shadow-[0_0_0_4px_rgba(220,174,103,0.1)]' 
                          : ''
                      } ${
                        hasError('routingNumber') 
                          ? 'border-destructive' 
                          : 'group-hover:border-bloom-gold/50'
                      }`}
                    />
                    <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full bg-bloom-gold transition-all duration-700 opacity-70"></div>
                  </div>
                  {getErrorMessage('routingNumber') && (
                    <p className="text-xs text-destructive flex items-center gap-1 animate-fade-in">
                      <AlertCircle size={12} />
                      {getErrorMessage('routingNumber')}
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2 pb-6">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-bloom-gold/80 via-bloom-gold to-bloom-gold/80 text-white hover:from-bloom-gold hover:to-bloom-gold hover:shadow-md hover:translate-y-[-2px] transition-all duration-300 overflow-hidden group relative"
              disabled={isProcessing}
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-out"></span>
              
              {isProcessing ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                <>
                  {paymentMethod === 'card' && (
                    <span className="flex items-center gap-1.5">
                      <CreditCard size={16} />
                      Pay ${parseFloat(amount || '0').toFixed(2)}
                    </span>
                  )}
                  {paymentMethod === 'paypal' && (
                    <span className="flex items-center gap-1.5">
                      <Wallet size={16} />
                      Pay with PayPal
                    </span>
                  )}
                  {paymentMethod === 'bank' && (
                    <span className="flex items-center gap-1.5">
                      <Building size={16} />
                      Continue to Bank Transfer
                    </span>
                  )}
                </>
              )}
            </Button>
            
            <div className="flex flex-col items-center justify-center gap-2 mt-3">
              <div className="flex items-center justify-center gap-1">
                <Lock size={12} className="text-bloom-gold" />
                <p className="text-xs text-center text-bloom-muted">
                  Your payment information is secure and encrypted
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-xs text-bloom-muted">
                  <CheckCircle size={12} className="text-green-500" />
                  <span>Secure</span>
                </div>
                <div className="w-1 h-1 bg-bloom-muted rounded-full"></div>
                <div className="flex items-center gap-1 text-xs text-bloom-muted">
                  <CheckCircle size={12} className="text-green-500" />
                  <span>Encrypted</span>
                </div>
                <div className="w-1 h-1 bg-bloom-muted rounded-full"></div>
                <div className="flex items-center gap-1 text-xs text-bloom-muted">
                  <CheckCircle size={12} className="text-green-500" />
                  <span>Protected</span>
                </div>
              </div>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default PaymentForm;