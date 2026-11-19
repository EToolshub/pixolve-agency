import type { Metadata } from "next";
import { NewPasswordView } from "@/components/account/NewPasswordView";

export const metadata: Metadata = {
  title: "Nueva contraseña",
  robots: { index: false },
};

export default function NuevaClavePage() {
  return <NewPasswordView />;
}
