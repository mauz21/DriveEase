import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center text-center p-4">
        <div className="rounded-full bg-red-100 p-6 mb-6">
          <AlertCircle className="h-12 w-12 text-red-600" />
        </div>
        <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-md">
          The page you are looking for doesn't exist or has been moved. Let's get you back on the road.
        </p>
        <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}
