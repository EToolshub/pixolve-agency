"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ClipboardList } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { getPendingOrder, savePendingOrder, type PendingOrder } from "@/lib/order-storage";
import { briefQuestions } from "@/data/briefs";
import type { BriefAnswer, ServiceBriefAnswers } from "@/lib/types";

export function BriefView() {
  const router = useRouter();
  const [order, setOrder] = useState<PendingOrder | null>(null);
  const [answers, setAnswers] = useState<Record<string, ServiceBriefAnswers>>({});
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    const pending = getPendingOrder();
    if (!pending) {
      router.replace("/carrito");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hidratación desde localStorage al montar
    setOrder(pending);
    setAnswers(pending.briefs ?? {});
  }, [router]);

  const services = useMemo(() => {
    if (!order) return [];
    const seen = new Map<string, string>();
    for (const item of order.items) {
      if (!seen.has(item.serviceSlug)) seen.set(item.serviceSlug, item.serviceName);
    }
    return Array.from(seen.entries())
      .map(([slug, name]) => ({ slug, name, questions: briefQuestions[slug] }))
      .filter((s) => s.questions && s.questions.length > 0);
  }, [order]);

  if (!order) return null;

  function setAnswer(serviceSlug: string, questionId: string, value: BriefAnswer) {
    setAnswers((prev) => ({
      ...prev,
      [serviceSlug]: { ...prev[serviceSlug], [questionId]: value },
    }));
  }

  function toggleCheckbox(serviceSlug: string, questionId: string, option: string) {
    const current = (answers[serviceSlug]?.[questionId] as string[]) ?? [];
    const next = current.includes(option)
      ? current.filter((o) => o !== option)
      : [...current, option];
    setAnswer(serviceSlug, questionId, next);
  }

  function isComplete() {
    return services.every((service) =>
      service.questions
        .filter((q) => q.required)
        .every((q) => {
          const value = answers[service.slug]?.[q.id];
          return typeof value === "string" && value.trim().length > 0;
        })
    );
  }

  function handleContinue() {
    if (!order) return;
    if (!isComplete()) {
      setShowErrors(true);
      return;
    }
    savePendingOrder({ ...order, briefs: answers });
    router.push("/checkout/pago");
  }

  return (
    <Container className="max-w-3xl py-16">
      <button
        onClick={() => router.push("/checkout")}
        className="mb-6 flex items-center gap-1.5 text-sm font-medium text-muted hover:text-blue-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a mis datos
      </button>

      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
          <ClipboardList className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-heading">
            Cuéntanos sobre tu proyecto
          </h1>
          <p className="mt-2 text-body">
            Responde estas preguntas para que nuestro equipo empiece a
            trabajar con la información exacta desde el primer día. Entre
            más detalle nos den, menos rondas de revisión necesitarás.
          </p>
        </div>
      </div>

      <div className="mt-10 space-y-10">
        {services.map((service) => (
          <div key={service.slug} className="rounded-2xl border border-default p-6 sm:p-8">
            <h2 className="text-lg font-bold text-heading">
              Briefing: {service.name}
            </h2>

            <div className="mt-6 space-y-6">
              {service.questions.map((question) => {
                const value = answers[service.slug]?.[question.id];
                const hasError =
                  showErrors &&
                  question.required &&
                  (typeof value !== "string" || value.trim().length === 0);

                return (
                  <div key={question.id}>
                    <label className="mb-1.5 block text-sm font-medium text-body-strong">
                      {question.label}
                      {question.required && (
                        <span className="text-blue-600"> *</span>
                      )}
                    </label>

                    {question.type === "text" && (
                      <input
                        type="text"
                        value={(value as string) ?? ""}
                        placeholder={question.placeholder}
                        onChange={(e) =>
                          setAnswer(service.slug, question.id, e.target.value)
                        }
                        className={cn(
                          "w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                          hasError ? "border-red-400" : "border-input"
                        )}
                      />
                    )}

                    {question.type === "textarea" && (
                      <textarea
                        rows={3}
                        value={(value as string) ?? ""}
                        placeholder={question.placeholder}
                        onChange={(e) =>
                          setAnswer(service.slug, question.id, e.target.value)
                        }
                        className={cn(
                          "w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                          hasError ? "border-red-400" : "border-input"
                        )}
                      />
                    )}

                    {question.type === "select" && (
                      <select
                        value={(value as string) ?? ""}
                        onChange={(e) =>
                          setAnswer(service.slug, question.id, e.target.value)
                        }
                        className={cn(
                          "w-full rounded-xl border bg-card px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                          hasError ? "border-red-400" : "border-input"
                        )}
                      >
                        <option value="" disabled>
                          Selecciona una opción
                        </option>
                        {question.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}

                    {question.type === "checkboxes" && (
                      <div className="flex flex-wrap gap-2">
                        {question.options?.map((option) => {
                          const selected = (
                            (value as string[]) ?? []
                          ).includes(option);
                          return (
                            <button
                              type="button"
                              key={option}
                              onClick={() =>
                                toggleCheckbox(service.slug, question.id, option)
                              }
                              className={cn(
                                "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                                selected
                                  ? "border-blue-600 bg-blue-600 text-white"
                                  : "border-input text-body hover:border-blue-300"
                              )}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {hasError && (
                      <p className="mt-1 text-xs text-red-600">
                        Este campo es necesario para continuar.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={handleContinue}
        fullWidth
        className="mt-8"
        icon={<ArrowRight className="h-4 w-4" />}
        iconPosition="right"
      >
        Continuar a método de pago
      </Button>
    </Container>
  );
}
