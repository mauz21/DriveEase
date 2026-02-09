import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCars, useCar } from "@/hooks/use-cars";
import { useDriver, useDrivers } from "@/hooks/use-drivers";
import { useCreateBooking } from "@/hooks/use-bookings";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { format, differenceInDays, addDays } from "date-fns";
import { CalendarIcon, Loader2, Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function Booking() {
  const [location, setLocation] = useLocation();
  const searchStr = useSearch();
  const params = new URLSearchParams(searchStr);
  const initialCarId = parseInt(params.get("carId") || "0");
  const initialDriverId = parseInt(params.get("driverId") || "0");

  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  
  // Form State
  const [step, setStep] = useState(1);
  const [selectedCarId, setSelectedCarId] = useState<number>(initialCarId);
  const [selectedDriverId, setSelectedDriverId] = useState<number>(initialDriverId);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>({
    from: new Date(),
    to: addDays(new Date(), 3)
  });
  const [pickupLoc, setPickupLoc] = useState("");
  const [dropoffLoc, setDropoffLoc] = useState("");

  // Data
  const { data: cars } = useCars();
  const { data: drivers } = useDrivers();
  const { data: selectedCar } = useCar(selectedCarId);
  const { data: selectedDriver } = useDriver(selectedDriverId);
  
  const createBooking = useCreateBooking();

  // Protect route
  useEffect(() => {
    if (!authLoading && !user) {
      toast({ title: "Login Required", description: "Please login to book a vehicle", variant: "destructive" });
      setTimeout(() => window.location.href = "/api/login", 1000);
    }
  }, [user, authLoading]);

  // Calculations
  const days = dateRange?.from && dateRange?.to ? differenceInDays(dateRange.to, dateRange.from) + 1 : 0;
  const carTotal = selectedCar ? selectedCar.pricePerDay * days : 0;
  const driverTotal = selectedDriver ? selectedDriver.pricePerDay * days : 0;
  const total = carTotal + driverTotal;

  const handleBooking = async () => {
    if (!selectedCarId || !dateRange?.from || !dateRange?.to || !pickupLoc || !dropoffLoc) return;

    createBooking.mutate({
      carId: selectedCarId,
      driverId: selectedDriverId || undefined,
      pickupDate: dateRange.from.toISOString(),
      dropoffDate: dateRange.to.toISOString(),
      pickupLocation: pickupLoc,
      dropoffLocation: dropoffLoc,
      totalPrice: total,
    }, {
      onSuccess: () => {
        setLocation("/dashboard");
      }
    });
  };

  if (authLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold mb-8">Complete Your Reservation</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Steps & Form */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Step 1: Trip Details */}
              <div className={cn("p-6 bg-white rounded-xl shadow-sm border", step === 1 ? "ring-2 ring-primary" : "")}>
                <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={() => setStep(1)}>
                  <h2 className="font-bold text-lg flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                    Trip Details
                  </h2>
                  {step > 1 && <Check className="text-green-500 h-5 w-5" />}
                </div>

                {step === 1 && (
                  <div className="space-y-4 animate-in slide-in-from-top-2 fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Pickup & Dropoff Dates</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateRange?.from ? (
                                dateRange.to ? (
                                  <>
                                    {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                                  </>
                                ) : (
                                  format(dateRange.from, "LLL dd, y")
                                )
                              ) : (
                                <span>Pick dates</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              initialFocus
                              mode="range"
                              defaultMonth={dateRange?.from}
                              selected={dateRange}
                              onSelect={(range: any) => setDateRange(range)}
                              numberOfMonths={2}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-2">
                         <label className="text-sm font-medium">Locations</label>
                         <Input placeholder="Pickup Address" value={pickupLoc} onChange={e => setPickupLoc(e.target.value)} className="mb-2" />
                         <Input placeholder="Dropoff Address" value={dropoffLoc} onChange={e => setDropoffLoc(e.target.value)} />
                      </div>
                    </div>
                    <Button onClick={() => setStep(2)} disabled={!dateRange?.to || !pickupLoc}>Next: Select Vehicle</Button>
                  </div>
                )}
              </div>

              {/* Step 2: Vehicle Selection */}
              <div className={cn("p-6 bg-white rounded-xl shadow-sm border", step === 2 ? "ring-2 ring-primary" : "")}>
                <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={() => setStep(2)}>
                   <h2 className="font-bold text-lg flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                    Vehicle Selection
                  </h2>
                  {step > 2 && <Check className="text-green-500 h-5 w-5" />}
                </div>
                
                {step === 2 && (
                   <div className="space-y-4 animate-in slide-in-from-top-2 fade-in">
                      {!initialCarId && (
                        <Select onValueChange={(val) => setSelectedCarId(parseInt(val))} value={selectedCarId.toString()}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a vehicle" />
                          </SelectTrigger>
                          <SelectContent>
                            {cars?.map(car => (
                              <SelectItem key={car.id} value={car.id.toString()}>{car.make} {car.model} (${car.pricePerDay}/day)</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      
                      {selectedCar && (
                        <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                          <img src={selectedCar.imageUrl} className="w-24 h-16 object-cover rounded" alt="Car" />
                          <div>
                            <h3 className="font-bold">{selectedCar.make} {selectedCar.model}</h3>
                            <p className="text-sm text-muted-foreground">{selectedCar.type} • {selectedCar.seats} seats</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                        <Button onClick={() => setStep(3)} disabled={!selectedCarId}>Next: Options</Button>
                      </div>
                   </div>
                )}
              </div>

              {/* Step 3: Driver & Confirm */}
              <div className={cn("p-6 bg-white rounded-xl shadow-sm border", step === 3 ? "ring-2 ring-primary" : "")}>
                 <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={() => setStep(3)}>
                   <h2 className="font-bold text-lg flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                    Options & Payment
                  </h2>
                </div>

                {step === 3 && (
                  <div className="space-y-6 animate-in slide-in-from-top-2 fade-in">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Add a Professional Chauffeur (Optional)</label>
                      <Select onValueChange={(val) => setSelectedDriverId(parseInt(val))} value={selectedDriverId ? selectedDriverId.toString() : "none"}>
                          <SelectTrigger>
                            <SelectValue placeholder="No driver needed" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Self-drive (No Chauffeur)</SelectItem>
                            {drivers?.map(driver => (
                              <SelectItem key={driver.id} value={driver.id.toString()}>{driver.name} (+${driver.pricePerDay}/day)</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <h3 className="font-bold mb-2">Mock Payment Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="Card Number" defaultValue="4242 4242 4242 4242" disabled />
                        <Input placeholder="MM/YY" defaultValue="12/25" disabled />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">This is a demo. No payment will be processed.</p>
                    </div>

                    <div className="flex gap-2">
                       <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                       <Button onClick={handleBooking} disabled={createBooking.isPending} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                         {createBooking.isPending ? <Loader2 className="animate-spin mr-2" /> : "Confirm & Pay"} 
                       </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-24">
                <h3 className="font-display text-xl font-bold mb-4">Booking Summary</h3>
                
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between pb-2 border-b">
                     <span className="text-muted-foreground">Duration</span>
                     <span className="font-medium">{days} Days</span>
                  </div>
                  
                  {selectedCar && (
                    <div className="flex justify-between pb-2 border-b">
                      <span className="text-muted-foreground">Vehicle</span>
                      <div className="text-right">
                        <div className="font-medium">{selectedCar.make} {selectedCar.model}</div>
                        <div className="text-xs text-muted-foreground">${selectedCar.pricePerDay} x {days}</div>
                      </div>
                      <span className="font-medium">${carTotal}</span>
                    </div>
                  )}

                  {selectedDriver && (
                    <div className="flex justify-between pb-2 border-b">
                      <span className="text-muted-foreground">Chauffeur</span>
                      <div className="text-right">
                        <div className="font-medium">{selectedDriver.name}</div>
                        <div className="text-xs text-muted-foreground">${selectedDriver.pricePerDay} x {days}</div>
                      </div>
                      <span className="font-medium">${driverTotal}</span>
                    </div>
                  )}

                  <div className="flex justify-between pt-2 text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">${total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
