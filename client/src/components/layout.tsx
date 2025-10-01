import { AppShell } from "./app-shell";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    
    <AppShell>
      {children}
    </AppShell>
  );
}