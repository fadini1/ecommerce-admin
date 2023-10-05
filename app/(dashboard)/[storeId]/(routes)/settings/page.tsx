import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

import SettingsForm from "./components/settings-form";

interface SettingsPageProps {
  params: { storeId: string; }
};

const SettingsPage: React.FC<SettingsPageProps> = async ({ params }) => {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const store = await prismadb.store.findFirst({
    where: {
      userId,
      id: params.storeId
    }
  });

  if (!store) {
    redirect('/');
  }

  return (
    <div className="flex-col">
      <div className="p-6">
        <SettingsForm 
          initialData={store}
        />
      </div>
    </div>
  )
}

export default SettingsPage;