import type { AddressRecord } from '../domain/types';

export function formatOneLineAddress(a: AddressRecord): string {
  // Prefer: house, street, locality/vtc, dist, state, pincode, country
  const cityLike = a.locality ?? a.vtc ?? '';
  const parts = [
    a.house,
    a.street,
    cityLike,
    a.dist,
    a.state,
    a.pincode,
    a.country,
  ]
    .filter((p): p is string => typeof p === 'string' && p.trim().length > 0)
    .map((x) => x.trim());

  return parts.join(', ');
}
