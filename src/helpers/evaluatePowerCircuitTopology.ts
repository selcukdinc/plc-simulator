import { PowerCircuit } from '../interface';

export function evaluatePowerCircuitTopology(
  powerCircuit: PowerCircuit,
  variables: { [id: string]: { value: boolean | number | null } }
): Set<string> {
  const energized = new Set<string>();
  if (!powerCircuit) return energized;

  // Build terminal → elementId map
  const terminalToElement: Record<string, string> = {};
  Object.values(powerCircuit.elements).forEach((el) => {
    el.terminals.forEach((t) => {
      terminalToElement[t.id] = el.id;
    });
  });

  // Build adjacency: elementId → connected elementIds via cables
  const adjacency: Record<string, string[]> = {};
  Object.values(powerCircuit.cables).forEach((cable) => {
    const fromEl = terminalToElement[cable.fromTerminalId];
    const toEl = terminalToElement[cable.toTerminalId];
    if (!fromEl || !toEl || fromEl === toEl) return;
    if (!adjacency[fromEl]) adjacency[fromEl] = [];
    if (!adjacency[toEl]) adjacency[toEl] = [];
    adjacency[fromEl].push(toEl);
    adjacency[toEl].push(fromEl);
  });

  // Start BFS from POWER_SOURCE elements
  const sources = Object.values(powerCircuit.elements)
    .filter((el) => el.type === 'POWER_SOURCE')
    .map((el) => el.id);

  const queue: string[] = [...sources];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const elementId = queue.shift()!;
    if (visited.has(elementId)) continue;
    visited.add(elementId);

    const el = powerCircuit.elements[elementId];
    if (!el) continue;

    // Check if this element conducts
    let conducts = false;
    if (el.type === 'POWER_SOURCE') {
      conducts = true;
    } else if (el.type === 'FUSE' || el.type === 'THERMAL_RELAY' || el.type === 'TERMINAL_BLOCK') {
      conducts = true; // passive elements always conduct
    } else if (el.type === 'CONTACTOR') {
      // conducts only if its ladder variable is true
      conducts = el.variableId ? Boolean(variables[el.variableId]?.value) : false;
    } else if (el.type === 'MOTOR') {
      conducts = false; // motor is a sink, does not propagate
    }

    energized.add(elementId);

    if (conducts) {
      const neighbors = adjacency[elementId] ?? [];
      neighbors.forEach((neighbor) => {
        if (!visited.has(neighbor)) queue.push(neighbor);
      });
    }
  }

  return energized;
}
