import { useDrivers } from "@/hooks/use-drivers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DriverCard from "@/components/DriverCard";
import { Loader2 } from "lucide-react";

export default function Drivers() {
  const { data: drivers, isLoading } = useDrivers();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="bg-secondary text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl font-bold">Professional Chauffeurs</h1>
          <p className="mt-2 text-gray-400">Experience the journey with our vetted experts.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
           <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {drivers?.map((driver) => (
              <DriverCard key={driver.id} driver={driver} />
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
