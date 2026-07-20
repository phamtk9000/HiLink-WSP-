import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ── StyledMap ──────────────────────────────────────────────────────────────
   A brand-styled, interactive map built on Leaflet + free raster tiles.
   No API key, no billing account, no usage cap beyond fair use — unlike
   Google Maps Embed (unstyleable) or Mapbox/MapTiler (key required).

   Tile styles available (all free, attribution required):
     positron  · CARTO Positron    — minimal warm-grey, almost no colour
     dark      · CARTO Dark Matter — near-black, for dark bands
     voyager   · CARTO Voyager     — light with restrained colour
     osm       · OpenStreetMap     — the classic, most colourful

   `tint` applies a light CSS grade so the tiles sit inside the cream/ink
   palette instead of looking like a stock map pasted onto the page.       */

const TILES = {
  positron: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd", maxZoom: 20,
  },
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd", maxZoom: 20,
  },
  voyager: {
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd", maxZoom: 20,
  },
  osm: {
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: "abc", maxZoom: 19,
  },
};

/* Gold pin drawn inline — no marker-image asset, no broken default icon. */
const goldPin = L.divIcon({
  className: "hl-pin",
  html: `<svg width="34" height="44" viewBox="0 0 34 44" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 43C17 43 32 27.6 32 16.6 32 8 25.3 1 17 1S2 8 2 16.6C2 27.6 17 43 17 43Z"
            fill="#A88F5C" stroke="#0F0F0F" stroke-width="1.5" stroke-linejoin="round"/>
      <circle cx="17" cy="16.5" r="5.2" fill="#0F0F0F"/>
    </svg>`,
  iconSize: [34, 44],
  iconAnchor: [17, 43],
});

export default function StyledMap({
  lat, lng, name,
  zoom = 16,
  tiles = "positron",
  tint = true,
  interactive = true,
  style,
}) {
  const elRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!elRef.current || mapRef.current) return;
    const cfg = TILES[tiles] || TILES.positron;
    const map = L.map(elRef.current, {
      center: [lat, lng],
      zoom,
      zoomControl: interactive,
      scrollWheelZoom: false,   // never hijack page scroll
      dragging: interactive,
      attributionControl: true,
    });
    L.tileLayer(cfg.url, { attribution: cfg.attribution, subdomains: cfg.subdomains, maxZoom: cfg.maxZoom, detectRetina: true }).addTo(map);
    L.marker([lat, lng], { icon: goldPin, keyboard: false, title: name }).addTo(map);
    if (interactive) map.zoomControl.setPosition("bottomright");
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    if (mapRef.current) mapRef.current.setView([lat, lng], zoom);
  }, [lat, lng, zoom]);

  return (
    <div ref={elRef} className={tint ? "hl-map hl-map--tint" : "hl-map"}
      style={{ position: "absolute", inset: 0, background: "var(--bg-2)", ...style }} />
  );
}
