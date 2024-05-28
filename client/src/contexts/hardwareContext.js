import { createContext, useContext } from "react";

export const HardwareContext = createContext();

export const useHardware = () => useContext(HardwareContext);