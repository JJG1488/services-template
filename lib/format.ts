export function formatPrice(price: number | null, priceType: string): string {
  if (price === null || price === undefined) {
    return "Contact for Quote";
  }

  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  switch (priceType) {
    case "starting_at":
      return `Starting at ${formatted}`;
    case "hourly":
      return `${formatted}/hr`;
    case "custom":
      return "Custom Quote";
    default:
      return formatted;
  }
}
