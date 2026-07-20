/* ── HiLink SmartOS — white-label booking handoff ──────────────────────────
   Central builder for external booking links. Sample link shape:
   https://hilinksmartos.com/book?solution=private-workspaces&location=obc&utm_source=hilink.vn
   Adjust the host/params here once the SmartOS tenant is provisioned.     */
export const SMARTOS_HOST = "https://hilinksmartos.com";

export const smartosBookUrl = ({ solution = "", location = "" } = {}) => {
  const q = new URLSearchParams();
  if (solution) q.set("solution", solution);
  if (location) q.set("location", location);
  q.set("utm_source", "hilink.vn");
  return `${SMARTOS_HOST}/book?${q.toString()}`;
};
