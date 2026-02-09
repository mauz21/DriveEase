import { useRoute, Link } from "wouter";
import { useCar } from "@/hooks/use-cars";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Check, Gauge, Fuel, Users, Calendar } from "lucide-react";

export default function CarDetails() {
  const [, params] = useRoute("/cars/:id");
  const id = parseInt(params?.id || "0");
  const { data: car, isLoading } = useCar(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Car not found</h1>
        <Button asChild><Link href="/cars">Back to Fleet</Link></Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Breadcrumb / Back */}
        <div className="container mx-auto px-4 py-6">
          <Link href="/cars" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Fleet
          </Link>
        </div>

        <div className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-lg">
                <img 
                  src={car.imageUrl} 
                  alt={`${car.make} ${car.model}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {/* Thumbnails placeholder using same image for demo */}
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-video w-full overflow-hidden rounded-lg bg-gray-100 cursor-pointer hover:opacity-80">
                    <img src={car.imageUrl} className="h-full w-full object-cover" alt="View" />
                  </div>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <div className="mb-6">
                <Badge className="bg-primary text-primary-foreground mb-2">{car.type}</Badge>
                <h1 className="font-display text-4xl font-bold text-foreground">{car.make} {car.model}</h1>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                   <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {car.year}</span>
                   <span className="flex items-center gap-1 font-bold text-yellow-600">★ {car.rating} Rating</span>
                </div>
              </div>

              <div className="mb-8 rounded-xl bg-slate-50 p-6 border border-slate-100">
                <div className="flex items-baseline justify-between mb-4">
                   <span className="text-lg font-medium text-muted-foreground">Daily Rate</span>
                   <span className="text-3xl font-bold text-primary">${car.pricePerDay}</span>
                </div>
                <Button asChild size="lg" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  <Link href={`/booking?carId=${car.id}`}>Book This Vehicle</Link>
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-xl font-bold mb-4">Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white border">
                      <Gauge className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Transmission</p>
                        <p className="font-medium">{car.transmission}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white border">
                      <Fuel className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Fuel Type</p>
                        <p className="font-medium">{car.fuelType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white border">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Seats</p>
                        <p className="font-medium">{car.seats} Persons</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-xl font-bold mb-4">Features</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {car.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
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
