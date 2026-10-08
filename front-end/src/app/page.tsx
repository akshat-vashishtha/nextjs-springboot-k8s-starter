"use client";

import React from "react";
import { useUserManagement } from "@/core/controller_hooks/facades/useUserManagement";
import { UserDashboardView } from "@/ui/presentation/UserDashboardView";

export default function HomePage() {
    const pageState = useUserManagement();

    return <UserDashboardView state={pageState} />;
}
