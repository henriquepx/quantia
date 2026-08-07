"use client";

import { useParams } from "next/navigation";
import { getCalculatorBySlug } from "@/lib/calculators/registry";
import NotFoundPage from "@/screens/NotFoundPage";
import { CalculatorPage } from "@/components/calculator/CalculatorPage";

export default function CalculatorPageWrapper() {
  const { slug } = useParams();

  const calculator = getCalculatorBySlug(slug as string);

  if (!calculator) {
    return <NotFoundPage />;
  }

  return <CalculatorPage config={calculator} />;
}