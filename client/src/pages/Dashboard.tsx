import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useBookings } from "@/hooks/use-bookings";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Calendar, MapPin, Car } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: bookings, isLoading: bookingsLoading, error } = useBookings();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = "/api/login";
    }
  }, [user, authLoading]);

  if (authLoading || bookingsLoading) {
    return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  }

  if (error) return <div className="h-screen flex items-center justify-center">Failed to load bookings</div>;

  const activeBookings = bookings?.filter(b => b.status === 'confirmed' || b.status === 'pending') || [];
  const pastBookings = bookings?.filter(b => b.status === 'completed' || b.status === 'cancelled') || [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Welcome back, {user?.firstName}</h1>
            <p className="text-muted-foreground">Manage your reservations and account.</p>
          </div>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <a href="/cars">Book New Trip</a>
          </Button>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active">Active Reservations ({activeBookings.length})</TabsTrigger>
            <TabsTrigger value="history">History ({pastBookings.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-4">
            {activeBookings.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed">
                <p className="text-muted-foreground">No active bookings found.</p>
              </div>
            ) : (
              activeBookings.map(booking => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            {pastBookings.map(booking => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}

function BookingCard({ booking }: { booking: any }) {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-48 bg-gray-100 aspect-video md:aspect-auto relative">
           <img src={booking.car.imageUrl} className="absolute inset-0 w-full h-full object-cover" alt="Car" />
        </div>
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-xl">{booking.car.make} {booking.car.model}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {booking.status}
                </span>
                <span>#{booking.id.toString().padStart(6, '0')}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg">${booking.totalPrice}</div>
              <div className="text-xs text-muted-foreground">Total Paid</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Dates</p>
                <p className="text-muted-foreground">
                  {format(new Date(booking.pickupDate), "MMM dd, yyyy")} - {format(new Date(booking.dropoffDate), "MMM dd, yyyy")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Locations</p>
                <p className="text-muted-foreground">Pick: {booking.pickupLocation}</p>
                <p className="text-muted-foreground">Drop: {booking.dropoffLocation}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
