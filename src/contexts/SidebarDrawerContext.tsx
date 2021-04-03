import { useDisclosure, UseDisclosureReturn } from "@chakra-ui/hooks";
import { useRouter } from "next/router";
import { createContext, ReactNode, useContext, useEffect } from "react";

type ISidebarDrawerContextData = UseDisclosureReturn;

const SidebarDrawerContext = createContext({} as ISidebarDrawerContextData);

interface ISidebarDrawerProviderProps {
  children: ReactNode;
}

export function SidebarDrawerProvider({
  children
}: ISidebarDrawerProviderProps) {
  const disclosure = useDisclosure();
  const router = useRouter();
  useEffect(() => {
    disclosure.onClose();
  }, [router.asPath]);
  return (
    <SidebarDrawerContext.Provider value={disclosure}>
      {children}
    </SidebarDrawerContext.Provider>
  );
}

export const useSidebarDrawer = () => useContext(SidebarDrawerContext);