import { 
  cars, drivers, bookings, 
  type Car, type InsertCar, 
  type Driver, type InsertDriver, 
  type Booking, type InsertBooking 
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte } from "drizzle-orm";
import { authStorage, type IAuthStorage } from "./replit_integrations/auth/storage";

export interface IStorage extends IAuthStorage {
  // Cars
  getCars(filters?: { type?: string; minPrice?: number; maxPrice?: number }): Promise<Car[]>;
  getCar(id: number): Promise<Car | undefined>;
  createCar(car: InsertCar): Promise<Car>;

  // Drivers
  getDrivers(): Promise<Driver[]>;
  getDriver(id: number): Promise<Driver | undefined>;
  createDriver(driver: InsertDriver): Promise<Driver>;

  // Bookings
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookings(userId: string): Promise<(Booking & { car: Car })[]>;
  getBooking(id: number): Promise<Booking | undefined>;
}

export class DatabaseStorage extends authStorage.constructor implements IStorage {
  constructor() {
    super();
  }

  // Cars
  async getCars(filters?: { type?: string; minPrice?: number; maxPrice?: number }): Promise<Car[]> {
    let query = db.select().from(cars);
    const conditions = [];

    if (filters?.type) {
      conditions.push(eq(cars.type, filters.type));
    }
    if (filters?.minPrice) {
      conditions.push(gte(cars.pricePerDay, filters.minPrice));
    }
    if (filters?.maxPrice) {
      conditions.push(lte(cars.pricePerDay, filters.maxPrice));
    }

    if (conditions.length > 0) {
      // @ts-ignore - complex generic types in drizzle
      return await query.where(and(...conditions));
    }
    
    return await query;
  }

  async getCar(id: number): Promise<Car | undefined> {
    const [car] = await db.select().from(cars).where(eq(cars.id, id));
    return car;
  }

  async createCar(insertCar: InsertCar): Promise<Car> {
    const [car] = await db.insert(cars).values(insertCar).returning();
    return car;
  }

  // Drivers
  async getDrivers(): Promise<Driver[]> {
    return await db.select().from(drivers);
  }

  async getDriver(id: number): Promise<Driver | undefined> {
    const [driver] = await db.select().from(drivers).where(eq(drivers.id, id));
    return driver;
  }

  async createDriver(insertDriver: InsertDriver): Promise<Driver> {
    const [driver] = await db.insert(drivers).values(insertDriver).returning();
    return driver;
  }

  // Bookings
  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const [booking] = await db.insert(bookings).values(insertBooking).returning();
    return booking;
  }

  async getBookings(userId: string): Promise<(Booking & { car: Car })[]> {
    // Join with cars to get car details for the booking list
    const result = await db.select({
      booking: bookings,
      car: cars,
    })
    .from(bookings)
    .innerJoin(cars, eq(bookings.carId, cars.id))
    .where(eq(bookings.userId, userId));
    
    return result.map(({ booking, car }) => ({ ...booking, car }));
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }
}

export const storage = new DatabaseStorage();
