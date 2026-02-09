import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // --- Cars ---
  app.get(api.cars.list.path, async (req, res) => {
    const type = typeof req.query.type === 'string' ? req.query.type : undefined;
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
    
    const cars = await storage.getCars({ type, minPrice, maxPrice });
    res.json(cars);
  });

  app.get(api.cars.get.path, async (req, res) => {
    const car = await storage.getCar(Number(req.params.id));
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json(car);
  });

  // --- Drivers ---
  app.get(api.drivers.list.path, async (req, res) => {
    const drivers = await storage.getDrivers();
    res.json(drivers);
  });

  app.get(api.drivers.get.path, async (req, res) => {
    const driver = await storage.getDriver(Number(req.params.id));
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.json(driver);
  });

  // --- Bookings ---
  app.post(api.bookings.create.path, isAuthenticated, async (req, res) => {
    try {
      // Ensure user is authenticated
      const user = req.user as any;
      const userId = user.claims.sub;
      
      const input = api.bookings.create.input.parse({
        ...req.body,
        userId, // Force userId from session
      });

      const booking = await storage.createBooking(input);
      res.status(201).json(booking);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.bookings.list.path, isAuthenticated, async (req, res) => {
    const user = req.user as any;
    const userId = user.claims.sub;
    const bookings = await storage.getBookings(userId);
    res.json(bookings);
  });

  app.get(api.bookings.get.path, isAuthenticated, async (req, res) => {
    const booking = await storage.getBooking(Number(req.params.id));
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check ownership
    const user = req.user as any;
    if (booking.userId !== user.claims.sub) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    res.json(booking);
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingCars = await storage.getCars();
  if (existingCars.length === 0) {
    console.log("Seeding database...");
    
    // Seed Cars
    await storage.createCar({
      make: "Mercedes-Benz",
      model: "S-Class",
      year: 2023,
      color: "Black",
      pricePerDay: 350,
      imageUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1000",
      type: "luxury",
      transmission: "automatic",
      fuelType: "gasoline",
      seats: 5,
      features: ["Leather Seats", "Autopilot", "Panoramic Roof", "Premium Sound"],
      isAvailable: true
    });

    await storage.createCar({
      make: "BMW",
      model: "7 Series",
      year: 2023,
      color: "White",
      pricePerDay: 320,
      imageUrl: "https://images.unsplash.com/photo-1555215695-3004980adade?auto=format&fit=crop&q=80&w=1000",
      type: "luxury",
      transmission: "automatic",
      fuelType: "gasoline",
      seats: 5,
      features: ["Massage Seats", "Rear Entertainment", "HUD"],
      isAvailable: true
    });

    await storage.createCar({
      make: "Tesla",
      model: "Model S Plaid",
      year: 2023,
      color: "Red",
      pricePerDay: 280,
      imageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=1000",
      type: "electric",
      transmission: "automatic",
      fuelType: "electric",
      seats: 5,
      features: ["Full Self-Driving", "Yoke Steering", "Ludicrous Mode"],
      isAvailable: true
    });

    await storage.createCar({
      make: "Porsche",
      model: "911 Carrera",
      year: 2022,
      color: "Silver",
      pricePerDay: 450,
      imageUrl: "https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&q=80&w=1000",
      type: "sports",
      transmission: "automatic",
      fuelType: "gasoline",
      seats: 2,
      features: ["Sport Chrono", "Launch Control", "Bose Sound"],
      isAvailable: true
    });

    // Seed Drivers
    await storage.createDriver({
      name: "James Wilson",
      yearsExperience: 10,
      rating: "4.9",
      bio: "Professional chauffeur with over 10 years of experience serving VIP clients. Expert in local routes and defensive driving.",
      imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
      languages: ["English", "French"],
      pricePerDay: 150,
      isVerified: true
    });

    await storage.createDriver({
      name: "Sarah Chen",
      yearsExperience: 7,
      rating: "4.8",
      bio: "Certified executive driver. Punctual, discreet, and fluent in multiple languages.",
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
      languages: ["English", "Mandarin", "Spanish"],
      pricePerDay: 130,
      isVerified: true
    });
  }
}
