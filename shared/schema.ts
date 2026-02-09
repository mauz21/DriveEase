import { pgTable, text, serial, integer, boolean, timestamp, numeric, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

export * from "./models/auth";

export const cars = pgTable("cars", {
  id: serial("id").primaryKey(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  color: text("color").notNull(),
  pricePerDay: integer("price_per_day").notNull(),
  imageUrl: text("image_url").notNull(),
  type: text("type").notNull(), // sedan, suv, sports, luxury, electric
  transmission: text("transmission").notNull(), // automatic, manual
  fuelType: text("fuel_type").notNull(), // gasoline, diesel, electric, hybrid
  seats: integer("seats").notNull(),
  features: jsonb("features").$type<string[]>().notNull(),
  isAvailable: boolean("is_available").default(true).notNull(),
  rating: numeric("rating", { precision: 2, scale: 1 }).default("5.0"),
});

export const drivers = pgTable("drivers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  yearsExperience: integer("years_experience").notNull(),
  rating: numeric("rating", { precision: 2, scale: 1 }).notNull(),
  bio: text("bio").notNull(),
  imageUrl: text("image_url").notNull(),
  languages: jsonb("languages").$type<string[]>().notNull(),
  pricePerDay: integer("price_per_day").notNull(),
  isVerified: boolean("is_verified").default(true).notNull(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // References auth user id (string)
  carId: integer("car_id").references(() => cars.id).notNull(),
  driverId: integer("driver_id").references(() => drivers.id), // Optional
  pickupDate: timestamp("pickup_date").notNull(),
  dropoffDate: timestamp("dropoff_date").notNull(),
  pickupLocation: text("pickup_location").notNull(),
  dropoffLocation: text("dropoff_location").notNull(),
  totalPrice: integer("total_price").notNull(),
  status: text("status").default("pending").notNull(), // pending, confirmed, completed, cancelled
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Schemas
export const insertCarSchema = createInsertSchema(cars).omit({ id: true, rating: true });
export const insertDriverSchema = createInsertSchema(drivers).omit({ id: true });
export const insertBookingSchema = createInsertSchema(bookings).omit({ 
  id: true, 
  userId: true, 
  createdAt: true, 
  status: true 
});

// Types
export type Car = typeof cars.$inferSelect;
export type InsertCar = z.infer<typeof insertCarSchema>;
export type Driver = typeof drivers.$inferSelect;
export type InsertDriver = z.infer<typeof insertDriverSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
