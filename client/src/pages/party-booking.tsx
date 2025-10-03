import React, { useState, useMemo } from 'react';
import { Calendar, Clock, MapPin, Save, Share, UserPlus, Shield, Bell, ChevronDown, CheckCircle, Ticket, Armchair, CreditCard, PartyPopper, Download, Share2, CalendarPlus } from 'lucide-react';

// A reusable input field component for the checkout form
const FormInput = ({ id, label, type = 'text', placeholder }) => (
    <div className="w-full">
        <label htmlFor={id} className="block text-sm font-medium text-blue-100 mb-2">{label}</label>
        <input
            type={type}
            id={id}
            name={id}
            placeholder={placeholder}
            className="w-full bg-white/10 border-2 border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/50 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
        />
    </div>
);


// Component for the final Confirmation step
const ConfirmationPage = ({ bookingDetails }) => {
    const { selectedTickets, selectedSeats, total, ticketTypes } = bookingDetails;

    const ticketSummary = Object.entries(selectedTickets)
        .filter(([, qty]) => qty > 0)
        .map(([id, qty]) => `${qty}x ${ticketTypes.find(t => t.id === id).name}`)
        .join(', ');
        
    const qrData = `Event: International Food & Wine Festival, Tickets: ${ticketSummary}, Seats: ${selectedSeats.join(', ')}, Total: $${total.toFixed(2)}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(qrData)}&bgcolor=1E293B&color=FFFFFF&qzone=1`;


    return (
        <div className="rounded-lg p-6 shadow-lg text-white text-center"
       style={{
     background: "linear-gradient(90deg, #9333EA 0%, #DB2777 100%)"
    }}

        >
            <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-green-400 w-10 h-10" />
                </div>
            </div>
            <h2 className="text-3xl font-bold mb-2 tracking-tight">Booking Confirmed!</h2>
            <p className="text-blue-100 text-sm mb-8">Your tickets have been sent to your email address.</p>
            
            <div className="bg-black/20 border border-white/10 rounded-lg p-6 text-left flex flex-col md:flex-row gap-6 items-center">
                <img src={qrCodeUrl} alt="Booking QR Code" className="rounded-lg" />
                <div className="grow">
                    <h3 className="text-xl font-bold mb-4">Your Booking Details</h3>
                    <div className="space-y-3 text-sm">
                        <div>
                            <p className="font-semibold text-blue-200">Tickets:</p>
                            <p>{ticketSummary}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-blue-200">Seats:</p>
                            <p className="font-mono tracking-wider">{selectedSeats.sort((a, b) => a - b).join(', ')}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-blue-200">Total Amount:</p>
                            <p className="font-bold text-lg">${total.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
                 <button className="w-full sm:w-auto flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <Download size={18} />
                    Download Tickets
                </button>
                <button className="w-full sm:w-auto flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <CalendarPlus size={18} />
                    Add to Calendar
                </button>
            </div>
        </div>
    );
};


// Component for the Checkout step
const CheckoutForm = ({ onBack, onContinue }) => {
    return (
        <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-lg p-6 shadow-lg text-white">
            <h2 className="text-2xl font-bold mb-2 tracking-tight">Checkout</h2>
            <p className="text-blue-100 text-sm mb-8">Complete your booking</p>

            <div className="space-y-6">
                <div>
                    <h3 className="text-xl font-bold mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput id="firstName" label="First Name" placeholder="Enter here" />
                        <FormInput id="lastName" label="Last Name" placeholder="Enter here" />
                        <FormInput id="email" label="Email" type="email" placeholder="Enter here" />
                        <FormInput id="phone" label="Phone Number" type="tel" placeholder="Enter here" />
                    </div>
                </div>

                <div className="flex items-end gap-4">
                    <div className="grow">
                        <FormInput id="promo" label="Promo Code" placeholder="Enter code" />
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium h-12 px-6 rounded-lg transition-colors">
                        Apply
                    </button>
                </div>
            </div>
             <div>
                     <h3 className="text-xl font-bold mb-4">Loyalty Points</h3>
                     <label htmlFor="loyalty" className="flex items-center space-x-3 cursor-pointer p-3 bg-white/5 rounded-lg">
                         <input id="loyalty" type="checkbox"  className="w-5 h-5 accent-blue-500 bg-gray-700 rounded border-gray-500 focus:ring-blue-600 ring-offset-gray-800 focus:ring-2"/>
                         <span className="text-white font-medium">Use 2450 points ($24)</span>
                     </label>
                 </div>

            <div className="flex justify-between items-center mt-10 pt-6 border-t border-white/10">
                <button
                    onClick={onBack}
                    className="bg-white/90 hover:bg-white text-black font-medium py-2 px-6 rounded-lg transition-colors"
                >
                    Back to Seats
                </button>
                <button
                    onClick={onContinue}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                    Continue to Payment
                </button>
            </div>
        </div>
    );
};

// Component for the Seat Selection step
const SeatSelection = ({ totalTickets, selectedSeats, onSeatSelect, onBack, onContinue }) => {
  const occupiedSeats = useMemo(() => new Set([3, 4, 5, 8, 9, 11, 12, 13, 18, 22, 23, 26, 28, 29, 30, 33, 36, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 72, 74, 75, 76, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100]), []);

  const handleSeatClick = (seatNumber) => {
    if (occupiedSeats.has(seatNumber)) return;
    const isSelected = selectedSeats.includes(seatNumber);
    if (isSelected) {
      onSeatSelect(selectedSeats.filter(seat => seat !== seatNumber));
    } else {
      if (selectedSeats.length < totalTickets) {
        onSeatSelect([...selectedSeats, seatNumber]);
      } else {
        alert(`You can only select ${totalTickets} seat(s).`);
      }
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-lg p-6 shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-2 tracking-tight">Choose Your Seats</h2>
      <p className="text-blue-100 text-sm mb-6">
        Select {totalTickets} seat(s) for your tickets. You have selected {selectedSeats.length}.
      </p>
      <div className="bg-linear-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center h-16 mb-6">
        <p className="text-xl font-bold tracking-widest">STAGE</p>
      </div>
      <div className="grid grid-cols-10 gap-x-4 gap-y-4 mx-auto max-w-xl mb-6">
        {[...Array(100)].map((_, i) => {
          const seatNumber = i + 1;
          const isOccupied = occupiedSeats.has(seatNumber);
          const isSelected = selectedSeats.includes(seatNumber);
          let seatClass = 'bg-gray-400/50 hover:bg-gray-400/80';
          if (isOccupied) seatClass = 'bg-red-600/80 cursor-not-allowed';
          if (isSelected) seatClass = 'bg-blue-500 ring-2 ring-offset-2 ring-offset-black/20 ring-blue-400';
          return <button key={seatNumber} onClick={() => handleSeatClick(seatNumber)} disabled={isOccupied} className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-xs transition-colors ${seatClass}`}>{seatNumber}</button>;
        })}
      </div>
      <div className="flex justify-center items-center gap-x-8 mb-6 text-xs font-semibold">
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-gray-400/50"></div><span>Available</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-blue-500"></div><span>Selected</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-red-600/80"></div><span>Occupied</span></div>
      </div>
      <div className="flex justify-between items-center mt-6">
        <button onClick={onBack} className="bg-white/90 hover:bg-white text-black font-medium py-2 px-6 rounded-lg transition-colors">Back to Tickets</button>
        {/* <button onClick={onContinue} disabled={selectedSeats.length !== totalTickets} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">Continue to Checkout</button> */}
                 <button onClick={onContinue}  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">Continue to Checkout</button>

      </div>
    </div>
  );
};

// The main parent component
const TicketBooking = () => {
  const [currentStep, setCurrentStep] = useState('selectTickets');
  const [selectedTickets, setSelectedTickets] = useState({ tasting: 0, chef: 0, vip: 0 });
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);

  const loyaltyPointsValue = 24.50;

  const ticketTypes = [
    { id: 'tasting', name: 'Tasting Pass', price: 75, available: 1500, description: 'Food and wine sampling', badge: 'tasting', badgeColor: 'bg-gray-100 text-gray-600', features: ['Food samples', 'Wine tastings', 'Recipe cards']},
    { id: 'chef', name: "Chef's Experience", price: 135, available: 800, description: 'Culinary masterclass experience', badge: 'chef', badgeColor: 'bg-gray-100 text-gray-600', features: ['Cooking demos', 'Chef meet & greet', 'Premium tastings']},
    { id: 'vip', name: 'VIP Culinary', price: 200, available: 200, description: 'Exclusive culinary journey', badge: 'vip', badgeColor: 'bg-purple-100 text-purple-600', features: ['Private tastings', 'Exclusive sessions', 'Gourmet dinner']}
  ];

  const handleTicketChange = (ticketId, quantity) => {
    setSelectedTickets(prev => ({ ...prev, [ticketId]: quantity }));
  };

  const totalTicketsSelected = Object.values(selectedTickets).reduce((sum, count) => sum + count, 0);
  const subtotal = useMemo(() => ticketTypes.reduce((total, ticket) => total + (ticket.price * selectedTickets[ticket.id]), 0), [selectedTickets, ticketTypes]);
  const platformFee = subtotal * 0.07;
  const loyaltyDiscount = useLoyaltyPoints ? loyaltyPointsValue : 0;
  const total = subtotal + platformFee - loyaltyDiscount;

  const stepperSteps = [
    { id: 1, name: 'Select Tickets', icon: <Ticket size={20} />, active: currentStep === 'selectTickets', completed: currentStep !== 'selectTickets' },
    { id: 2, name: 'Choose Seats', icon: <Armchair size={20} />, active: currentStep === 'chooseSeats', completed: currentStep === 'checkout' || currentStep === 'confirmation' },
    { id: 3, name: 'Checkout', icon: <CreditCard size={20} />, active: currentStep === 'checkout', completed: currentStep === 'confirmation' },
    { id: 4, name: 'Confirmation', icon: <PartyPopper size={20} />, active: currentStep === 'confirmation', completed: currentStep === 'confirmation' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 font-sans" style={{ background: 'linear-gradient(135deg, #4c1d95 0%, #1e3a8a 100%)'}}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            {stepperSteps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium transition-all duration-300 ${step.active ? 'bg-blue-500 border-2 border-blue-500 text-white scale-110' : step.completed ? 'bg-green-500 border-2 border-green-500 text-white' : 'border-2 border-gray-500 text-gray-400'}`}>
                    {step.completed && step.id !== 4 ? <CheckCircle size={24}/> : step.icon}
                  </div>
                  <span className={`text-sm font-medium ${step.active ? 'text-blue-400' : 'text-gray-400'}`}>{step.name}</span>
                </div>
                {index < stepperSteps.length - 1 && <div className={`w-16 h-0.5 transition-all duration-500 ${step.completed ? 'bg-green-500' : 'bg-gray-600'}`}></div>}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-lg overflow-hidden shadow-lg">
                <div className="h-48 bg-cover bg-center p-6 flex flex-col justify-end text-white" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1964&auto=format&fit=crop')" }}>
                    <div className="z-10"><h1 className="text-3xl font-bold mb-1 drop-shadow-lg">International Food & Wine Festival</h1><p className="text-blue-100 drop-shadow-md">Culinary Arts Society</p></div>
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-4 flex items-center justify-around text-sm bg-black/20">
                    <div className="flex items-center space-x-2"><Calendar className="w-4 h-4 text-blue-400" /><span>10/5/2025</span></div>
                    <div className="flex items-center space-x-2"><Clock className="w-4 h-4 text-blue-400" /><span>12:00 PM</span></div>
                    <div className="flex items-center space-x-2"><MapPin className="w-4 h-4 text-blue-400" /><span>Riverside Park Pavilion</span></div>
                </div>
            </div>
            {currentStep === 'selectTickets' && (
              <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Select Your Tickets</h2>
                <p className="text-blue-100 text-sm mb-6">Choose the ticket type and quantity</p>
                <div className="space-y-4">
                  {ticketTypes.map((ticket) => (
                    <div key={ticket.id} className="border border-white/20 rounded-lg p-4 bg-black/10">
                       <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3"><h3 className="text-white font-bold text-lg">{ticket.name}</h3><span className={`px-3 py-1 rounded-full text-xs font-bold ${ticket.badgeColor}`}>{ticket.badge}</span></div>
                        <div className="text-right"><div className="text-white font-bold text-lg">${ticket.price}</div><div className="text-blue-100 text-xs">{ticket.available} available</div></div>
                        </div><p className="text-blue-100 text-sm mb-3">{ticket.description}</p>
                       <div className="flex flex-wrap gap-2 mb-4">{ticket.features.map((feature, index) => (<span key={index} className="border border-gray-300/60 rounded-full px-3 py-1 text-xs font-medium text-blue-100 bg-white/5">{feature}</span>))}</div>
                       <div className="relative w-32">
                          <select className="appearance-none bg-white/10 border border-white/20 rounded-md text-white px-3 py-2 text-sm w-full focus:outline-hidden focus:ring-2 focus:ring-blue-500" value={selectedTickets[ticket.id]} onChange={(e) => handleTicketChange(ticket.id, parseInt(e.target.value))}>
                              {[...Array(11)].map((_, i) => (<option key={i} value={i} className="bg-gray-800 text-white">{i}</option>))}
                          </select>
                          <ChevronDown className="w-4 h-4 text-white/50 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end">
                                <button onClick={() => setCurrentStep('chooseSeats')} className="w-48 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg mt-6 transition-colors justify-end disabled:bg-gray-500 disabled:cursor-not-allowed" disabled={totalTicketsSelected === 0}>{`Continue `}</button>
</div>
                {/* <button onClick={() => setCurrentStep('chooseSeats')} className="w-48 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg mt-6 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed" disabled={totalTicketsSelected === 0}>{`Continue with ${totalTicketsSelected} Ticket(s)`}</button> */}
              </div>
            )}
            {currentStep === 'chooseSeats' && <SeatSelection totalTickets={totalTicketsSelected} selectedSeats={selectedSeats} onSeatSelect={setSelectedSeats} onBack={() => setCurrentStep('selectTickets')} onContinue={() => setCurrentStep('checkout')}/>}
            {currentStep === 'checkout' && <CheckoutForm onBack={() => setCurrentStep('chooseSeats')} onContinue={() => {setCurrentStep('confirmation');}}/>}
            {currentStep === 'confirmation' && <ConfirmationPage bookingDetails={{selectedTickets, selectedSeats, total, ticketTypes}} />}
          </div>
          <div className="lg:col-span-1">
            {currentStep !== 'confirmation' && (
              <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-lg p-6 shadow-lg sticky top-8">
                <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">Order Summary</h2>
                <div className="space-y-4 pb-4 border-b border-white/20">
                  <div className="flex justify-between items-center text-sm"><span className="text-blue-100">Subtotal</span><span className="text-white">${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between items-center text-sm"><span className="text-blue-100">Platform Fee (7%)</span><span className="text-white">${platformFee.toFixed(2)}</span></div>
                  {loyaltyDiscount > 0 && <div className="flex justify-between items-center text-sm"><span className="text-green-400">Loyalty Discount</span><span className="text-green-400">-${loyaltyDiscount.toFixed(2)}</span></div>}
                </div>
                <div className="pt-4 pb-4">
                  <div className="flex justify-between items-center"><span className="text-white font-bold text-lg">Total</span><span className="text-white font-bold text-lg">${total.toFixed(2)}</span></div>
                </div>
                <div className="space-y-4 pt-4 border-t border-white/20">
                  {/* {currentStep === 'checkout' && (
                       
                  )} */}
                  {selectedSeats.length > 0 && (
                    <div>
                        <h3 className="text-base font-bold text-white mb-2">Selected Seats</h3>
                        <div className="flex flex-wrap gap-2">
                            {selectedSeats.sort((a, b) => a - b).map(seat => (
                                <span key={seat} className="bg-blue-500 text-white text-xs font-bold w-7 h-7 flex items-center justify-center rounded-full">{seat}</span>
                            ))}
                        </div>
                    </div>
                  )}
                </div>
                <div className="pt-6 flex space-x-2">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs font-medium text-blue-100 hover:bg-white/20 transition-colors"><Save className="w-4 h-4" />Save</button>
                  <button className="flex-1 flex items-center justify-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs font-medium text-blue-100 hover:bg-white/20 transition-colors"><Share className="w-4 h-4" />Share</button>
                  <button className="flex-1 flex items-center justify-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs font-medium text-blue-100 hover:bg-white/20 transition-colors"><UserPlus className="w-4 h-4" />Invite</button>
                </div>
                <div className="pt-4 space-y-2 text-xs text-blue-100"><div className="flex items-center space-x-2"><Shield className="w-3 h-3" /><span>Secure payment with Stripe</span></div><div className="flex items-center space-x-2"><Bell className="w-3 h-3" /><span>Get notifications for updates</span></div></div>
              </div>
            )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default TicketBooking;