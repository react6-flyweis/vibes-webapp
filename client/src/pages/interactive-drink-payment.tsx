import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, 
  Smartphone, 
  QrCode, 
  Waves, 
  CheckCircle, 
  AlertCircle, 
  Timer, 
  Zap,
  Gift,
  Star,
  Trophy,
  Sparkles,
  Heart,
  ThumbsUp,
  Coffee,
  Martini,
  Beer,
  Wine,
  ArrowRight,
  ArrowLeft,
  X,
  Plus,
  Minus,
  ShoppingCart,
  Loader2
} from "lucide-react";

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: any;
  processingTime: string;
  discount?: number;
  popular?: boolean;
  available: boolean;
}

interface PaymentStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
}

interface DrinkItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  image?: string;
  customizations: string[];
}

export default function InteractiveDrinkPayment() {
  const [currentStep, setCurrentStep] = useState<'cart' | 'payment' | 'processing' | 'confirmation'>('cart');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [cartItems, setCartItems] = useState<DrinkItem[]>([]);
  const [paymentSteps, setPaymentSteps] = useState<PaymentStep[]>([]);
  const [paymentProgress, setPaymentProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [tipAmount, setTipAmount] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Sample cart data - in real app this would come from context/props
  useEffect(() => {
    setCartItems([
      {
        id: "drink-mojito",
        name: "Classic Mojito",
        price: 12,
        quantity: 2,
        category: "cocktail",
        customizations: ["Extra Mint", "Less Sugar"]
      },
      {
        id: "drink-espresso-martini",
        name: "Espresso Martini",
        price: 14,
        quantity: 1,
        category: "cocktail",
        customizations: []
      }
    ]);
  }, []);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'nfc',
      name: 'NFC Wristband',
      description: 'Tap your wristband to pay instantly',
      icon: Waves,
      processingTime: '< 1 second',
      discount: 5,
      popular: true,
      available: true
    },
    {
      id: 'qr',
      name: 'QR Code',
      description: 'Scan with your phone to pay',
      icon: QrCode,
      processingTime: '< 3 seconds',
      available: true
    },
    {
      id: 'mobile',
      name: 'Mobile Payment',
      description: 'Apple Pay, Google Pay, Samsung Pay',
      icon: Smartphone,
      processingTime: '< 5 seconds',
      available: true
    },
    {
      id: 'card',
      name: 'Credit Card',
      description: 'Traditional card payment',
      icon: CreditCard,
      processingTime: '< 10 seconds',
      available: false
    }
  ];

  const paymentProcessMutation = useMutation({
    mutationFn: async (paymentData: any) => {
      const response = await apiRequest("POST", "/api/drinks/interactive-payment", paymentData);
      return response.json();
    },
    onSuccess: (data) => {
      setShowCelebration(true);
      setLoyaltyPoints(data.loyaltyPointsEarned || 25);
      toast({
        title: "Payment Successful!",
        description: `Order confirmed! You earned ${data.loyaltyPointsEarned || 25} loyalty points.`,
      });
      
      // Clear cart and refresh data
      setCartItems([]);
      queryClient.invalidateQueries({ queryKey: ["/api/drinks/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/drinks/real-time-stats"] });
    },
    onError: (error) => {
      toast({
        title: "Payment Failed",
        description: "There was an issue processing your payment. Please try again.",
        variant: "destructive",
      });
      setCurrentStep('payment');
      setIsProcessing(false);
    },
  });

  const promoMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await apiRequest("POST", "/api/drinks/apply-promo", { code });
      return response.json();
    },
    onSuccess: (data) => {
      setDiscount(data.discount);
      toast({
        title: "Promo Applied!",
        description: `${data.discount}% discount applied to your order.`,
      });
    },
    onError: () => {
      toast({
        title: "Invalid Promo Code",
        description: "The promo code you entered is not valid.",
        variant: "destructive",
      });
    },
  });

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = (subtotal * discount) / 100;
  const tip = tipAmount;
  const total = subtotal - discountAmount + tip;

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCartItems(prev => prev.filter(item => item.id !== itemId));
    } else {
      setCartItems(prev => 
        prev.map(item => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "cocktail": return Martini;
      case "beer": return Beer;
      case "wine": return Wine;
      case "coffee": return Coffee;
      default: return Wine;
    }
  };

  const initializePaymentSteps = (method: string) => {
    const baseSteps = [
      { id: 'validate', title: 'Validating Payment', description: 'Checking payment method', status: 'processing' as const, progress: 0 },
      { id: 'process', title: 'Processing Payment', description: 'Securing transaction', status: 'pending' as const, progress: 0 },
      { id: 'confirm', title: 'Confirming Order', description: 'Creating your order', status: 'pending' as const, progress: 0 },
      { id: 'notify', title: 'Notifying Bar', description: 'Sending to preparation queue', status: 'pending' as const, progress: 0 }
    ];

    if (method === 'nfc') {
      baseSteps[0].description = 'Reading NFC wristband';
    } else if (method === 'qr') {
      baseSteps[0].description = 'Processing QR scan';
    }

    setPaymentSteps(baseSteps);
  };

  const processPayment = async () => {
    if (!selectedPaymentMethod) {
      toast({
        title: "Select Payment Method",
        description: "Please choose a payment method to continue.",
        variant: "destructive",
      });
      return;
    }

    setCurrentStep('processing');
    setIsProcessing(true);
    initializePaymentSteps(selectedPaymentMethod);

    // Simulate payment processing with realistic timing
    const delays = { nfc: 800, qr: 2000, mobile: 3000, card: 5000 };
    const totalDelay = delays[selectedPaymentMethod as keyof typeof delays] || 3000;
    const stepDelay = totalDelay / 4;

    for (let i = 0; i < paymentSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, stepDelay));
      
      setPaymentSteps(prev => prev.map((step, index) => {
        if (index < i) return { ...step, status: 'completed', progress: 100 };
        if (index === i) return { ...step, status: 'processing', progress: Math.random() * 50 + 50 };
        return step;
      }));
      
      setPaymentProgress((i + 1) / 4 * 100);
    }

    // Complete all steps
    setPaymentSteps(prev => prev.map(step => ({ ...step, status: 'completed' as const, progress: 100 })));
    setPaymentProgress(100);

    // Process payment
    const paymentData = {
      items: cartItems,
      totalAmount: total,
      paymentMethod: selectedPaymentMethod,
      tipAmount: tip,
      promoCode: promoCode || null,
      discount: discountAmount,
      vendorId: "vendor-paradise-bar" // Automatically credit vendor account
    };

    paymentProcessMutation.mutate(paymentData);
    
    setTimeout(() => {
      setCurrentStep('confirmation');
      setIsProcessing(false);
    }, 1000);
  };

  const applyPromoCode = () => {
    if (promoCode.trim()) {
      promoMutation.mutate(promoCode.trim());
    }
  };

  const renderCart = () => (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShoppingCart className="mr-2 h-6 w-6" />
          Your Order
        </CardTitle>
        <CardDescription>Review your items and proceed to payment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {cartItems.map((item) => {
          const Icon = getCategoryIcon(item.category);
          return (
            <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-4">
                <Icon className="h-8 w-8 text-purple-600" />
                <div>
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">${item.price}</p>
                  {item.customizations.length > 0 && (
                    <p className="text-xs text-gray-500">{item.customizations.join(', ')}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <span className="ml-4 font-semibold w-16 text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}

        <Separator />

        {/* Promo Code */}
        <div className="flex space-x-2">
          <Input
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            disabled={promoMutation.isPending}
          />
          <Button 
            onClick={applyPromoCode}
            disabled={!promoCode.trim() || promoMutation.isPending}
          >
            {promoMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
          </Button>
        </div>

        {/* Tip Selection */}
        <div>
          <Label className="text-sm font-medium">Add Tip</Label>
          <div className="flex space-x-2 mt-2">
            {[0, 2, 3, 5].map(amount => (
              <Button
                key={amount}
                size="sm"
                variant={tipAmount === amount ? "default" : "outline"}
                onClick={() => setTipAmount(amount)}
              >
                {amount === 0 ? "No Tip" : `$${amount}`}
              </Button>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-2 pt-4 border-t">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({discount}%):</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}
          {tip > 0 && (
            <div className="flex justify-between">
              <span>Tip:</span>
              <span>${tip.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <Button 
          className="w-full" 
          size="lg"
          onClick={() => setCurrentStep('payment')}
          disabled={cartItems.length === 0}
        >
          Proceed to Payment
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );

  const renderPaymentMethods = () => (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2 h-6 w-6" />
          Choose Payment Method
        </CardTitle>
        <CardDescription>Select how you'd like to pay for your drinks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <div
                key={method.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedPaymentMethod === method.id
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : method.available
                    ? 'border-gray-200 hover:border-gray-300'
                    : 'border-gray-100 opacity-50 cursor-not-allowed'
                }`}
                onClick={() => method.available && setSelectedPaymentMethod(method.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Icon className={`h-8 w-8 ${method.available ? 'text-purple-600' : 'text-gray-400'}`} />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold">{method.name}</h4>
                        {method.popular && (
                          <Badge variant="secondary" className="text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                        {method.discount && (
                          <Badge variant="default" className="text-xs">
                            {method.discount}% off
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{method.description}</p>
                      <p className="text-xs text-gray-500">{method.processingTime}</p>
                    </div>
                  </div>
                  {!method.available && (
                    <Badge variant="destructive" className="text-xs">Unavailable</Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex space-x-3 pt-4">
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep('cart')}
            className="flex-1"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Button>
          <Button 
            onClick={processPayment}
            disabled={!selectedPaymentMethod}
            className="flex-1"
            size="lg"
          >
            Pay ${total.toFixed(2)}
            <Zap className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderProcessing = () => (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center">
          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          Processing Payment
        </CardTitle>
        <CardDescription>Please don't close this window</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-purple-600 mb-2">
            ${total.toFixed(2)}
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Processing via {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}
          </p>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <Progress value={paymentProgress} className="w-full" />
            <p className="text-sm text-gray-500 mt-2">{Math.round(paymentProgress)}% complete</p>
          </div>

          {paymentSteps.map((step, index) => (
            <div key={step.id} className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step.status === 'completed' ? 'bg-green-500 text-white' :
                step.status === 'processing' ? 'bg-purple-500 text-white' :
                step.status === 'error' ? 'bg-red-500 text-white' :
                'bg-gray-200 text-gray-400'
              }`}>
                {step.status === 'completed' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : step.status === 'processing' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : step.status === 'error' ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <Timer className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{step.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{step.description}</p>
                {step.status === 'processing' && (
                  <Progress value={step.progress} className="w-full mt-1" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderConfirmation = () => (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
          showCelebration ? 'bg-green-500 animate-pulse' : 'bg-green-500'
        }`}>
          <CheckCircle className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-2xl">Payment Successful!</CardTitle>
        <CardDescription>Your order has been confirmed and sent to the bar</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-2">
          <div className="text-3xl font-bold text-green-600">${total.toFixed(2)}</div>
          <p className="text-gray-600 dark:text-gray-300">
            Paid via {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}
          </p>
        </div>

        {loyaltyPoints > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <span className="font-semibold">You earned {loyaltyPoints} loyalty points!</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Use points for discounts on future orders
            </p>
          </div>
        )}

        <div className="space-y-3">
          <h4 className="font-semibold">Order Summary:</h4>
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.name} x{item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Timer className="h-5 w-5 text-purple-600" />
            <span className="font-semibold">Estimated wait time: 5-8 minutes</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            You'll receive a notification when your order is ready for pickup
          </p>
        </div>

        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={() => {
              setCurrentStep('cart');
              setSelectedPaymentMethod('');
              setPaymentProgress(0);
              setShowCelebration(false);
              setTipAmount(0);
              setPromoCode('');
              setDiscount(0);
            }}
            className="flex-1"
          >
            Order More Drinks
          </Button>
          <Button className="flex-1">
            <Gift className="mr-2 h-4 w-4" />
            Share & Rate
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-4">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Interactive Drink Payment
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Experience seamless, engaging payment for your party drinks
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[
              { step: 'cart', label: 'Cart', icon: ShoppingCart },
              { step: 'payment', label: 'Payment', icon: CreditCard },
              { step: 'processing', label: 'Processing', icon: Loader2 },
              { step: 'confirmation', label: 'Confirmation', icon: CheckCircle }
            ].map(({ step, label, icon: Icon }, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep === step ? 'bg-purple-600 text-white' :
                  index < ['cart', 'payment', 'processing', 'confirmation'].indexOf(currentStep) ? 'bg-green-500 text-white' :
                  'bg-gray-200 text-gray-400'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="ml-2 text-sm font-medium">{label}</span>
                {index < 3 && <ArrowRight className="h-4 w-4 mx-3 text-gray-400" />}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        {currentStep === 'cart' && renderCart()}
        {currentStep === 'payment' && renderPaymentMethods()}
        {currentStep === 'processing' && renderProcessing()}
        {currentStep === 'confirmation' && renderConfirmation()}

        {/* Celebration Animation */}
        {showCelebration && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            <div className="text-6xl animate-bounce">🎉</div>
          </div>
        )}
      </div>
    </div>
  );
}