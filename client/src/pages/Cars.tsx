import { useState } from "react";
import { useCars } from "@/hooks/use-cars";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CarCard from "@/components/CarCard";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";

export default function Cars() {
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [type, setType] = useState<string>("all");
  
  const { data: cars, isLoading } = useCars({
    type: type === "all" ? undefined : type,
    maxPrice: priceRange[1],
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="bg-secondary text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl font-bold">Our Exclusive Fleet</h1>
          <p className="mt-2 text-gray-400">Browse our collection of premium vehicles.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filters */}
        <div className="mb-12 rounded-xl border bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Vehicle Type</label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4 md:col-span-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Price Range</span>
                <span className="text-muted-foreground">${priceRange[0]} - ${priceRange[1]}/day</span>
              </div>
              <Slider
                defaultValue={[0, 2000]}
                max={2000}
                step={50}
                value={priceRange}
                onValueChange={setPriceRange}
                className="py-4"
              />
            </div>

            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Search className="mr-2 h-4 w-4" /> Filter
            </Button>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : cars?.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold">No vehicles found</h3>
            <p className="text-muted-foreground">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {cars?.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
