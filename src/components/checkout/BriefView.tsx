"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ClipboardList, CloudCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { FieldWrapper, Input, Select, Textarea } from "@/components/ui/Field";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { cn } from "@/lib/utils";
import { iconMap } from "@/lib/icon-map";
import { getPendingOrder, savePendingOrder, type PendingOrder } from "@/lib/order-storage";
import { briefQuestions } from "@/data/briefs";
import { getServiceBySlug } from "@/data/services";
import type { BriefAnswer, ServiceBriefAnswers } from "@/lib/types";

function isAnswered(value: BriefAnswer | undefined) {
  return typeof value === "string" ? value.trim().length > 0 : Array.isArray(value) && value.length > 0;
}

export function BriefView() {
  const router = useRouter();
  const [order, setOrder] = useState<PendingOrder | null>(null);
  const [answers, setAnswers] = useState<Record<string, ServiceBriefAnswers>>({});
  const [showErrors, setShowErrors] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const saveTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const pending = getPendingOrder();
    if (!pending || pending.confirmedAt) {
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

  // Guardado automático del borrador para no perder respuestas.
  useEffect(() => {
    if (!order) return;
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      savePendingOrder({ ...order, briefs: answers });
      setSavedAt(Date.now());
    }, 600);
    return () => window.clearTimeout(saveTimer.current);
  }, [answers, order]);

  if (!order) return <Container className="min-h-[60vh] py-16" />;

  const required = services.flatMap((service) =>
    service.questions.filter((q) => q.required).map((q) => ({ slug: service.slug, id: q.id }))
  );
  const answeredRequired = required.filter((q) => isAnswered(answers[q.slug]?.[q.id])).length;
  const progress = required.length === 0 ? 100 : Math.round((answeredRequired / required.length) * 100);

  function setAnswer(serviceSlug: string, questionId: string, value: BriefAnswer) {
    setAnswers((prev) => ({
      ...prev,
      [serviceSlug]: { ...prev[serviceSlug], [questionId]: value },
    }));
  }

  function toggleCheckbox(serviceSlug: string, questionId: string, option: string) {
    const current = (answers[serviceSlug]?.[questionId] as string[]) ?? [];
    const next = current.includes(option) ? current.filter((o) => o !== option) : [...current, option];
    setAnswer(serviceSlug, questionId, next);
  }

  function handleContinue() {
    if (!order) return;
    if (answeredRequired < required.length) {
      setShowErrors(true);
      const firstMissing = required.find((q) => !isAnswered(answers[q.slug]?.[q.id]));
      if (firstMissing) {
        document.getElementById(`${firstMissing.slug}-${firstMissing.id}`)?.focus();
      }
      return;
    }
    savePendingOrder({ ...order, briefs: answers });
    router.push("/checkout/pago");
  }

  return (
    <Container className="py-12 sm:py-16">
      <CheckoutSteps current={2} />

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px] lg:gap-10">
        <div className="order-2 lg:order-1">
          <Link href="/checkout" className="-my-2 inline-flex items-center gap-1.5 py-2 text-sm font-medium text-muted transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Volver a mis datos
          </Link>

          <div className="mt-4 flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-500 text-ink-950">
              <ClipboardList className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-heading sm:text-4xl">Cuéntanos sobre tu proyecto</h1>
              <p className="mt-2 text-body">
                Con esta información empezamos a trabajar desde el primer día. Entre más
                detalle nos des, menos rondas de revisión necesitarás.
              </p>
            </div>
          </div>

          {/* Progreso del briefing */}
          <div className="sticky top-[5.25rem] z-20 mt-8 rounded-2xl border border-white/10 bg-ink-900/90 p-4 backdrop-blur-xl">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-heading">
                {answeredRequired} de {required.length} respuestas obligatorias
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted" aria-live="polite">
                {savedAt ? (
                  <>
                    <CloudCheck className="h-3.5 w-3.5 text-emerald-400" /> Borrador guardado
                  </>
                ) : (
                  "Se guarda automáticamente"
                )}
              </span>
            </div>
            <div
              className="mt-3 h-2 overflow-hidden rounded-full bg-white/5"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progreso del briefing"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mt-6 space-y-6">
            {services.map((service) => {
              const Icon = iconMap[getServiceBySlug(service.slug)?.icon ?? ""];
              return (
                <fieldset key={service.slug} className="rounded-3xl border border-default bg-card p-6 sm:p-8">
                  <legend className="sr-only">Briefing: {service.name}</legend>
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 ring-1 ring-brand-500/20">
                      {Icon && <Icon className="h-5 w-5" />}
                    </span>
                    <h2 className="text-lg font-bold text-heading">{service.name}</h2>
                  </div>

                  <div className="mt-7 space-y-6">
                    {service.questions.map((question) => {
                      const value = answers[service.slug]?.[question.id];
                      const fieldId = `${service.slug}-${question.id}`;
                      const error =
                        showErrors && question.required && !isAnswered(value)
                          ? "Este campo es necesario para continuar."
                          : undefined;
                      const valid = Boolean(question.required) && isAnswered(value);

                      if (question.type === "checkboxes") {
                        return (
                          <div key={question.id} role="group" aria-labelledby={`${fieldId}-label`}>
                            <p id={`${fieldId}-label`} className="mb-3 text-sm font-medium text-body-strong">
                              {question.label}
                              <span className="ml-2 text-xs font-normal text-subtle">Elige una o varias</span>
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {question.options?.map((option) => {
                                const selected = ((value as string[]) ?? []).includes(option);
                                return (
                                  <button
                                    type="button"
                                    key={option}
                                    aria-pressed={selected}
                                    onClick={() => toggleCheckbox(service.slug, question.id, option)}
                                    className={cn(
                                      "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all active:scale-95",
                                      selected
                                        ? "border-brand-500 bg-brand-500 text-ink-950"
                                        : "border-input text-body hover:border-brand-500/50 hover:text-white"
                                    )}
                                  >
                                    {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                                    {option}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }

                      return (
                        <FieldWrapper
                          key={question.id}
                          id={fieldId}
                          label={question.label}
                          required={question.required}
                          optional={!question.required}
                          error={error}
                          valid={question.type !== "select" && valid}
                        >
                          {question.type === "text" && (
                            <Input
                              id={fieldId}
                              value={(value as string) ?? ""}
                              placeholder={question.placeholder}
                              invalid={error}
                              valid={valid}
                              onChange={(e) => setAnswer(service.slug, question.id, e.target.value)}
                            />
                          )}
                          {question.type === "textarea" && (
                            <Textarea
                              id={fieldId}
                              rows={3}
                              value={(value as string) ?? ""}
                              placeholder={question.placeholder}
                              invalid={error}
                              valid={valid}
                              onChange={(e) => setAnswer(service.slug, question.id, e.target.value)}
                            />
                          )}
                          {question.type === "select" && (
                            <Select
                              id={fieldId}
                              value={(value as string) ?? ""}
                              invalid={error}
                              onChange={(e) => setAnswer(service.slug, question.id, e.target.value)}
                            >
                              <option value="" disabled>
                                Selecciona una opción
                              </option>
                              {question.options?.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </Select>
                          )}
                        </FieldWrapper>
                      );
                    })}
                  </div>
                </fieldset>
              );
            })}
          </div>

          {showErrors && answeredRequired < required.length && (
            <p role="alert" className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm text-red-300">
              Te faltan {required.length - answeredRequired} respuesta(s) obligatoria(s) marcadas con *.
            </p>
          )}

          <Button
            onClick={handleContinue}
            fullWidth
            size="lg"
            className="mt-6"
            icon={<ArrowRight className="h-5 w-5" />}
            iconPosition="right"
          >
            Continuar al pago
          </Button>
        </div>

        <OrderSummary
          className="order-1 lg:order-2"
          items={order.items}
          totalUnico={order.totalUnico}
          totalMensual={order.totalMensual}
          orderId={order.orderId}
        />
      </div>
    </Container>
  );
}
