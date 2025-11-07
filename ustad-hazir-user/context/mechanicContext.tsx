import React, { createContext, useContext, useState, ReactNode } from "react";

type Service = {
  id: string;
  serviceName: string;
  description?: string;
  price: string;
  duration?: string;
  category: string;
};

type MechanicContextType = {
  services: Service[];
  addService: (service: Service) => void;
  clearServices: () => void;
};

const MechanicContext = createContext<MechanicContextType | undefined>(undefined);

export const MechanicProvider = ({ children }: { children: ReactNode }) => {
  const [services, setServices] = useState<Service[]>([]);

  const addService = (service: Service) => {
    setServices((prev) => [...prev, service]);
  };

  const clearServices = () => {
    setServices([]);
  };

  return (
    <MechanicContext.Provider value={{ services, addService, clearServices }}>
      {children}
    </MechanicContext.Provider>
  );
};

export const useMechanic = (): MechanicContextType => {
  const context = useContext(MechanicContext);
  if (!context) {
    throw new Error("useMechanic must be used within a MechanicProvider");
  }
  return context;
};
