import { Link } from "wouter";
import { useCars } from "@/hooks/use-cars";
import { Button } from "@/components/ui/button";
import CarCard from "@/components/CarCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, ShieldCheck, Clock, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { data: cars, isLoading } = useCars();
  const featuredCars = cars?.slice(0, 3);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full overflow-hidden bg-slate-900">
        {/* Unsplash luxury car image */}
        <div className="absolute inset-0">
          <img 
            src="https://pixabay.com/get/g810e980a4e1f9d3c4641fadc718639cae6c608f8de3efde6134a326590c2f822898cbaa6eaeee640cb579917daadda02aa03b151af2745f9b3fe5d770e6970f5_1280.png" 
            alt="Luxury Car" 
            className="h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        </div>

        <div className="relative container mx-auto flex h-full flex-col justify-center px-4 pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl text-white"
          >
            <h1 className="font-display text-5xl font-bold leading-tight md:text-7xl">
              Elevate Your <span className="text-primary">Journey</span>
            </h1>
            <p className="mt-6 text-lg text-gray-300 md:text-xl">
              Experience the pinnacle of automotive engineering. Rent the world's most exclusive vehicles with or without a professional chauffeur.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/cars">View Fleet</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm">
                <Link href="/drivers">Hire a Chauffeur</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Premium Insurance",
                description: "Full coverage included with every rental for your peace of mind."
              },
              {
                icon: Clock,
                title: "24/7 Support",
                description: "Our concierge team is available around the clock to assist you."
              },
              {
                icon: Award,
                title: "Top Rated Drivers",
                description: "Professional, vetted chauffeurs with extensive experience."
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100"
              >
                <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Fleet */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold md:text-4xl">Featured <span className="text-primary">Vehicles</span></h2>
              <p className="mt-2 text-muted-foreground">Select from our exclusive collection.</p>
            </div>
            <Button asChild variant="link" className="hidden text-primary md:inline-flex">
              <Link href="/cars">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[400px] w-full animate-pulse rounded-2xl bg-gray-200" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredCars?.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
          
          <div className="mt-8 text-center md:hidden">
            <Button asChild variant="outline">
              <Link href="/cars">View All Vehicles</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-secondary text-secondary-foreground overflow-hidden">
        <div className="absolute inset-0 z-0">
             {/* Unsplash abstract dark texture */}
            <img 
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000&auto=format&fit=crop"
              alt="Background"
              className="w-full h-full object-cover opacity-10"
            />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h2 className="font-display text-4xl font-bold text-white md:text-5xl">
            Ready for your <span className="text-primary">Next Trip?</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
            Book now and enjoy an unforgettable driving experience. Whether it's a business trip or a weekend getaway, we have the perfect vehicle for you.
          </p>
          <Button asChild size="lg" className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg">
            <Link href="/cars">Book Your Ride</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
