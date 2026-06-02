// Paise BigInt-safe formatters mirroring the wallet app conventions.

export function formatPaise(paise: string | number | bigint): string {
  const n = typeof paise === 'string' ? BigInt(paise || '0') : BigInt(paise);
  const negative = n < 0n;
  const abs = negative ? -n : n;
  const rupees = abs / 100n;
  const fraction = (abs % 100n).toString().padStart(2, '0');
  const formatted = rupees.toLocaleString('en-IN');
  return `${negative ? '-' : ''}₹${formatted}.${fraction}`;
}

export function formatPaiseCompact(paise: string | number | bigint): string {
  const n = typeof paise === 'string' ? BigInt(paise || '0') : BigInt(paise);
  const rupees = Number(n / 100n);
  if (rupees >= 1_00_00_000) return `₹${(rupees / 1_00_00_000).toFixed(2)}Cr`;
  if (rupees >= 1_00_000) return `₹${(rupees / 1_00_000).toFixed(2)}L`;
  if (rupees >= 1_000) return `₹${(rupees / 1_000).toFixed(1)}k`;
  return `₹${rupees.toLocaleString('en-IN')}`;
}

export function formatDateTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return iso; }
}

export function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch { return iso; }
}

export function formatRelative(iso: string): string {
  try {
    const d = new Date(iso).getTime();
    const diff = Date.now() - d;
    const min = Math.floor(diff / 60000);
    if (min < 1) return 'just now';
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;
    const day = Math.floor(hr / 24);
    if (day < 30) return `${day}d ago`;
    return formatDate(iso);
  } catch { return iso; }
}

export function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0]?.toUpperCase()).join('');
}

export function shortId(id: string, head = 6, tail = 4): string {
  if (!id) return '';
  if (id.length <= head + tail + 1) return id;
  return `${id.slice(0, head)}…${id.slice(-tail)}`;
}
