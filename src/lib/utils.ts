export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-SN", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function timeAgo(date: Date | string): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "A l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  if (hours < 24) return `Il y a ${hours}h`;
  if (days < 7) return `Il y a ${days}j`;
  return formatDate(date);
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    LOCATION: "Location",
    VENTE: "Vente",
    TERRAIN: "Terrain",
    PRODUIT: "Produit",
  };
  return labels[category] || category;
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    LOCATION: "bg-blue-100 text-blue-800",
    VENTE: "bg-green-100 text-green-800",
    TERRAIN: "bg-amber-100 text-amber-800",
    PRODUIT: "bg-purple-100 text-purple-800",
  };
  return colors[category] || "bg-gray-100 text-gray-800";
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    ACTIVE: "Active",
    PENDING: "En attente",
    SOLD: "Vendu",
    REJECTED: "Rejetée",
  };
  return labels[status] || status;
}

export function parseJsonArray(json: string): string[] {
  try {
    return JSON.parse(json);
  } catch {
    return [];
  }
}
