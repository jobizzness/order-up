import { redirect } from "next/navigation";
import { verifyAuthRequest } from "@/app/auth/verifyAuthRequest";
import { ApplicationLayout } from "@/components/layout";
import { CategoriesManager } from "@/components/categories/CategoriesManager";
import { prisma } from "@/lib/prisma";

export default async function CategoriesPage() {
  const auth = await verifyAuthRequest();
  if (!auth.ok) {
    redirect("/auth/login");
  }

  const user = auth.user;
  let tenantId: string;

  if (user.role === "platform_admin") {
    const tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      return (
        <ApplicationLayout>
          <div className="p-4 bg-destructive/10 text-destructive rounded-xl border border-destructive/20">
            No tenants found in the database.
          </div>
        </ApplicationLayout>
      );
    }
    tenantId = tenant.id;
  } else {
    if (user.ownedTenants.length === 0) {
      redirect("/auth/onboarding");
    }
    tenantId = user.ownedTenants[0].id;
  }

  return (
    <ApplicationLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage menu categories and their sort order.
          </p>
        </div>
        <CategoriesManager tenantId={tenantId} />
      </div>
    </ApplicationLayout>
  );
}
