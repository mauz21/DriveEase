import { Link } from "wouter";
import { type Car } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Fuel, Gauge, Users, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function CarCard({ car }: { car: Car }) {
  return (
    <Card className="group overflow-hidden rounded-2xl border border-white/5 bg-black/5 dark:bg-white/5 shadow-2xl transition-all duration-500 hover:shadow-[#FFD700]/10 hover:-translate-y-2">
      <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-900 relative">
        <div className="absolute top-4 right-4 z-10 rounded-full bg-black/80 px-4 py-1.5 text-sm font-bold text-[#FFD700] shadow-xl backdrop-blur-md border border-[#FFD700]/30">
          ${car.pricePerDay}/day
        </div>
        <img 
          src={car.imageUrl} 
          alt={`${car.make} ${car.model}`}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{car.make}</p>
            <h3 className="font-display text-2xl font-bold">{car.model}</h3>
          </div>
          <div className="flex items-center gap-1 rounded-md bg-[#FFD700]/10 px-2 py-1 text-xs font-bold text-[#FFD700]">
            ★ {car.rating}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 border-t border-border pt-4 text-sm text-muted-foreground">
          <div className="flex flex-col items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{car.seats} Seats</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Fuel className="h-4 w-4" />
            <span>{car.fuelType}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Gauge className="h-4 w-4" />
            <span>{car.transmission}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
          <Link href={`/cars/${car.id}`}>
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
