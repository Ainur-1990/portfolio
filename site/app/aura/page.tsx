import type { Metadata } from "next";
import AuraApp from "./AuraApp";

export const metadata: Metadata = {
  title: "AURA — ИИ-ассистент | Аинур",
  description:
    "Прототип AURA OS: киберпанк-ассистент с пульсирующей 3D-сферой, памятью на 7 дней и локальным ИИ-ядром.",
};

export default function AuraPage() {
  return <AuraApp />;
}
