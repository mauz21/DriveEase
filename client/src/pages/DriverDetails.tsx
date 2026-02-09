import { useRoute, Link } from "wouter";
import { useDriver } from "@/hooks/use-drivers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Star, Clock, Globe, Shield } from "lucide-react";

export default function DriverDetails() {
  const [, params] = useRoute("/drivers/:id");
  const id = parseInt(params?.id || "0");
  const { data: driver, isLoading } = useDriver(id);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  if (!driver) return <div className="min-h-screen flex items-center justify-center">Driver not found</div>;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <Link href="/drivers" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Chauffeurs
          </Link>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="bg-gray-100 md:col-span-1 h-96 md:h-full relative">
                 <img src={driver.imageUrl} alt={driver.name} className="absolute inset-0 w-full h-full object-cover" />
              </div>
              
              <div className="p-8 md:col-span-2 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="font-display text-4xl font-bold mb-2">{driver.name}</h1>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {driver.yearsExperience} Years Experience</span>
                        <span className="flex items-center gap-1 font-bold text-yellow-600"><Star className="h-4 w-4 fill-yellow-600" /> {driver.rating}</span>
                      </div>
                    </div>
                    <div className="text-right">
                       <span className="block text-3xl font-bold text-primary">${driver.pricePerDay}</span>
                       <span className="text-sm text-muted-foreground">/day</span>
                    </div>
                  </div>

                  <hr className="my-6 border-gray-100" />
                  
                  <div className="prose prose-sm text-muted-foreground max-w-none mb-8">
                    <p>{driver.bio}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-bold text-foreground flex items-center gap-2 mb-3">
                        <Globe className="h-4 w-4 text-primary" /> Languages
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {driver.languages.map(lang => (
                          <span key={lang} className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">{lang}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground flex items-center gap-2 mb-3">
                        <Shield className="h-4 w-4 text-primary" /> Verification
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Background check passed. License verified. Clean driving record.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t flex justify-end">
                   <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link href={`/booking?driverId=${driver.id}`}>Hire {driver.name}</Link>
                   </Button>
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
