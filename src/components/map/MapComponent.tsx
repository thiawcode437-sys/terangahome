"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapUser {
  id: string;
  name: string;
  role: string;
  city: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
  isOnline: boolean;
  lastSeenAt: string | null;
  _count: { annonces: number };
}

interface MapComponentProps {
  users: MapUser[];
  center?: [number, number];
  zoom?: number;
  onUserClick?: (userId: string) => void;
}

const roleColors: Record<string, string> = {
  AGENT: "#00853F",
  VENDEUR: "#E31B23",
  CLIENT: "#2563EB",
  ADMIN: "#7C3AED",
};

const roleLabels: Record<string, string> = {
  AGENT: "Agent immobilier",
  VENDEUR: "Vendeur",
  CLIENT: "Client",
  ADMIN: "Administrateur",
};

function createCustomIcon(role: string, isOnline: boolean) {
  const color = roleColors[role] || "#6B7280";
  const onlineRing = isOnline
    ? `<circle cx="28" cy="8" r="6" fill="#22C55E" stroke="white" stroke-width="2"/>`
    : "";

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
      <path d="M18 0C8.059 0 0 8.059 0 18c0 13.5 18 26 18 26s18-12.5 18-26C36 8.059 27.941 0 18 0z" fill="${color}"/>
      <circle cx="18" cy="16" r="9" fill="white"/>
      <text x="18" y="20" text-anchor="middle" font-size="12" font-weight="bold" fill="${color}">${role[0]}</text>
      ${onlineRing}
    </svg>
  `;

  return L.divIcon({
    html: svg,
    className: "custom-marker",
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -44],
  });
}

export default function MapComponent({
  users,
  center = [14.6928, -17.4467],
  zoom = 12,
  onUserClick,
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView(center, zoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add user markers
    users.forEach((user) => {
      if (user.latitude && user.longitude) {
        const icon = createCustomIcon(user.role, user.isOnline);

        const lastSeen = user.lastSeenAt
          ? new Date(user.lastSeenAt).toLocaleString("fr-FR")
          : "Inconnu";

        const popup = `
          <div style="min-width: 200px; font-family: system-ui, sans-serif;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <div style="width: 36px; height: 36px; background: ${roleColors[user.role] || "#6B7280"}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px;">
                ${user.name[0]}
              </div>
              <div>
                <div style="font-weight: 600; font-size: 14px;">${user.name}</div>
                <div style="font-size: 11px; color: #6B7280;">${roleLabels[user.role] || user.role}</div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: ${user.isOnline ? "#22C55E" : "#9CA3AF"}; display: inline-block;"></span>
              <span style="font-size: 12px; color: ${user.isOnline ? "#22C55E" : "#9CA3AF"};">
                ${user.isOnline ? "En ligne" : "Hors ligne"}
              </span>
            </div>
            ${user.city ? `<div style="font-size: 12px; color: #6B7280; margin-bottom: 2px;">📍 ${user.city}</div>` : ""}
            ${user.phone ? `<div style="font-size: 12px; color: #6B7280; margin-bottom: 2px;">📞 ${user.phone}</div>` : ""}
            <div style="font-size: 12px; color: #6B7280; margin-bottom: 4px;">📢 ${user._count.annonces} annonce(s)</div>
            <div style="font-size: 11px; color: #9CA3AF;">Vu le ${lastSeen}</div>
            <div style="margin-top: 8px;">
              <a href="/messages?contact=${user.id}"
                 style="display: inline-block; padding: 4px 12px; background: ${roleColors[user.role] || "#6B7280"}; color: white; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: 500;">
                Contacter
              </a>
              <a href="/annonces?userId=${user.id}"
                 style="display: inline-block; padding: 4px 12px; background: #F3F4F6; color: #374151; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: 500; margin-left: 4px;">
                Voir annonces
              </a>
            </div>
          </div>
        `;

        const marker = L.marker([user.latitude, user.longitude], { icon })
          .addTo(map)
          .bindPopup(popup);

        if (onUserClick) {
          marker.on("click", () => onUserClick(user.id));
        }
      }
    });

    // Fit bounds if users exist
    if (users.length > 0) {
      const validUsers = users.filter((u) => u.latitude && u.longitude);
      if (validUsers.length > 0) {
        const bounds = L.latLngBounds(
          validUsers.map((u) => [u.latitude, u.longitude] as [number, number])
        );
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      }
    }
  }, [users, onUserClick]);

  return (
    <div ref={mapRef} className="w-full h-full rounded-xl overflow-hidden" />
  );
}
