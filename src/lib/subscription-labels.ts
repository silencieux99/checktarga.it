export function describeSubscriptionStatus(status: string): string {
  switch (status) {
    case "trialing":
      return "Periodo iniziale";
    case "active":
      return "Attivo";
    case "past_due":
      return "Pagamento in sospeso";
    case "canceled":
      return "Annullato";
    case "unpaid":
      return "Non pagato";
    default:
      return status;
  }
}
