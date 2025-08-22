import type { PermissionsNode } from '../domain/types';

/**
 * Flatten a nested permissions tree into permission keys.
 * Example input:
 * {
 *   PROFILE: { actions: ['VIEW', 'MODIFY'] },
 *   BILL_PAYMENT: { ONLINE: { MULTIPLE: { actions: ['VIEW'] }, actions: ['VIEW'] } }
 * }
 * Output (examples):
 * [
 *   "PROFILE.VIEW",
 *   "PROFILE.MODIFY",
 *   "BILL_PAYMENT.VIEW",
 *   "BILL_PAYMENT.ONLINE.VIEW",
 *   "BILL_PAYMENT.ONLINE.MULTIPLE.VIEW"
 * ]
 */
export function flattenPermissionsTree(tree: Record<string, PermissionsNode>): string[] {
  const out: string[] = [];

  function walk(node: PermissionsNode, path: string[]) {
    if (Array.isArray(node.actions)) {
      for (const act of node.actions) {
        const key = (path.length ? path.join('.') + '.' : '') + act.toUpperCase();
        out.push(key);
      }
    }
    for (const [k, v] of Object.entries(node)) {
      if (k === 'actions') continue;
      if (v && typeof v === 'object') {
        walk(v as PermissionsNode, [...path, k]);
      }
    }
  }

  for (const [k, v] of Object.entries(tree)) {
    if (v && typeof v === 'object') walk(v as PermissionsNode, [k]);
  }

  // de-dup just in case
  return Array.from(new Set(out));
}
