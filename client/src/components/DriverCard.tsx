import { Link } from "wouter";
import { type Driver } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Star, Clock } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function DriverCard({ driver }: { driver: Driver }) {
  return (
    <Card className="overflow-hidden rounded-2xl border-none shadow-md transition-all hover:shadow-lg">
      <div className="flex flex-col sm:flex-row">
        <div className="relative aspect-square w-full sm:w-48 overflow-hidden bg-gray-100">
          <img 
            src={driver.imageUrl} 
            alt={driver.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col justify-between p-6">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold">{driver.name}</h3>
              {driver.isVerified && (
                <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                  <CheckCircle2 className="h-3 w-3" /> Verified
                </span>
              )}
            </div>
            
            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-foreground">{driver.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{driver.yearsExperience} Years Exp.</span>
              </div>
            </div>

            <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">
              {driver.bio}
            </p>
          </div>
          
          <div className="mt-6 flex items-center justify-between">
            <span className="text-lg font-bold text-primary">
              ${driver.pricePerDay}<span className="text-sm font-normal text-muted-foreground">/day</span>
            </span>
            <Button asChild variant="outline" className="border-primary/20 hover:bg-primary/5 hover:text-primary">
              <Link href={`/drivers/${driver.id}`}>View Profile</Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
