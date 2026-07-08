import {
  formatPrice,
  formatSubscriptionBillingPeriod,
  getSubscriptionTerms,
  type PricingPlan,
} from "@/lib/pricing";
import { SUBSCRIPTION_PRE_PAYMENT_NOTICE } from "@/lib/company";

interface SubscriptionTermsProps {
  plan: PricingPlan;
  variant?: "default" | "compact" | "finePrint";
}

export default function SubscriptionTerms({
  plan,
  variant = "default",
}: SubscriptionTermsProps) {
  if (!plan.subscription) return null;

  const { introPrice, recurringPrice, trialHours, recurringCredits } = plan.subscription;

  if (variant === "compact") {
    return (
      <p className="text-xs leading-relaxed text-slate-600">{getSubscriptionTerms(plan)}</p>
    );
  }

  if (variant === "finePrint") {
    return (
      <div className="space-y-2 text-[10px] leading-relaxed text-slate-500">
        <p className="font-semibold text-slate-700">{SUBSCRIPTION_PRE_PAYMENT_NOTICE}</p>
        <p>
          <span className="font-semibold text-slate-600">Pagamento iniziale.</span>{" "}
          {formatPrice(introPrice)} oggi per {plan.reports} credito
          {plan.reports > 1 ? "i" : ""} immediato{plan.reports > 1 ? "i" : ""}. La carta viene
          salvata in modo sicuro tramite Stripe.
        </p>
        <p>
          <span className="font-semibold text-slate-600">Rinnovo automatico.</span> Trascorse{" "}
          {trialHours} ore: {formatPrice(recurringPrice)}{" "}
          {formatSubscriptionBillingPeriod(plan.subscription)} con {recurringCredits} nuovo
          {recurringCredits > 1 ? "i" : ""} credito
          {recurringCredits > 1 ? "i" : ""}. L&apos;addebito avviene automaticamente sulla carta
          salvata.
        </p>
        <p>
          <span className="font-semibold text-slate-600">Cancellazione semplice.</span> Puoi annullare
          l&apos;abbonamento in qualsiasi momento dall&apos;area personale, prima del prossimo
          addebito.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
      <p className="text-sm font-semibold text-slate-900">{SUBSCRIPTION_PRE_PAYMENT_NOTICE}</p>
      <div>
        <p className="text-sm font-semibold text-slate-900">Pagamento iniziale</p>
        <p className="text-sm text-slate-600">
          {formatPrice(introPrice)} oggi per {plan.reports} credito
          {plan.reports > 1 ? "i" : ""} immediato{plan.reports > 1 ? "i" : ""}. La carta viene
          salvata in modo sicuro tramite Stripe.
        </p>
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900">Rinnovo automatico</p>
        <p className="text-sm text-slate-600">
          Trascorse {trialHours} ore: {formatPrice(recurringPrice)}{" "}
          {formatSubscriptionBillingPeriod(plan.subscription)} con {recurringCredits} nuovo
          {recurringCredits > 1 ? "i" : ""} credito{recurringCredits > 1 ? "i" : ""}. L&apos;addebito
          avviene automaticamente sulla carta salvata.
        </p>
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900">Cancellazione semplice</p>
        <p className="text-sm text-slate-600">
          Puoi annullare l&apos;abbonamento in qualsiasi momento dall&apos;area personale, prima del
          prossimo addebito.
        </p>
      </div>
    </div>
  );
}
