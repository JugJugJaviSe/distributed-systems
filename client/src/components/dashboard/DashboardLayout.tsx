import type { DashboardLayoutProps } from "../../types/player/DashboardLayoutProps";


export function DashboardLayout({ navbar, children }: DashboardLayoutProps) {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900">
      {navbar}

      <div className="w-full flex flex-col items-center gap-6 py-6">
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;
