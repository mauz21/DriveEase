import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type Driver } from "@shared/schema";

export function useDrivers() {
  return useQuery({
    queryKey: [api.drivers.list.path],
    queryFn: async () => {
      const res = await fetch(api.drivers.list.path);
      if (!res.ok) throw new Error("Failed to fetch drivers");
      return api.drivers.list.responses[200].parse(await res.json());
    },
  });
}

export function useDriver(id: number) {
  return useQuery({
    queryKey: [api.drivers.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.drivers.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch driver");
      return api.drivers.get.responses[200].parse(await res.json());
    },
  });
}
