import { Scene, SceneBlock } from '../interface';

interface SceneUpdates {
  blockTargets: { [id: string]: { targetX: number; targetY: number } };
  sensorTriggers: { [variableId: string]: boolean };
}

function getBlockBounds(block: SceneBlock): { left: number; right: number; top: number; bottom: number } {
  const w = 60; // approximate block width
  const h = 40; // approximate block height
  return {
    left: block.x - w / 2,
    right: block.x + w / 2,
    top: block.y - h / 2,
    bottom: block.y + h / 2,
  };
}

export function evaluateSceneBlocks(
  scene: Scene,
  variables: { [id: string]: { value: boolean | number | null } },
  deltaMs: number
): SceneUpdates {
  const blockTargets: SceneUpdates['blockTargets'] = {};
  const sensorTriggers: SceneUpdates['sensorTriggers'] = {};

  if (!scene) return { blockTargets, sensorTriggers };

  const deltaS = deltaMs / 1000;

  // Update block targets based on variable values
  Object.values(scene.blocks).forEach((block) => {
    const { forwardVariableId, backwardVariableId } = block.axes;
    const forwardActive = forwardVariableId ? Boolean(variables[forwardVariableId]?.value) : false;
    const backwardActive = backwardVariableId ? Boolean(variables[backwardVariableId]?.value) : false;

    let newX = block.targetX;
    let newY = block.targetY;
    const delta = block.speedPxPerSec * deltaS;

    if (block.type === 'CRANE_TROLLEY' || block.type === 'CONVEYOR') {
      if (forwardActive && !backwardActive) newX += delta;
      if (backwardActive && !forwardActive) newX -= delta;
    } else if (block.type === 'CRANE_HOOK' || block.type === 'LIFT_TABLE' || block.type === 'PNEUMATIC_CYL') {
      if (forwardActive && !backwardActive) newY -= delta; // up
      if (backwardActive && !forwardActive) newY += delta; // down
    }

    // Clamp to bounds
    newX = Math.max(block.minX, Math.min(block.maxX, newX));
    newY = Math.max(block.minY, Math.min(block.maxY, newY));

    if (newX !== block.targetX || newY !== block.targetY) {
      blockTargets[block.id] = { targetX: newX, targetY: newY };
    }
  });

  // Check sensor collisions
  Object.values(scene.sensors).forEach((sensor) => {
    if (!sensor.variableId) return;
    let triggered = false;
    Object.values(scene.blocks).forEach((block) => {
      const bounds = getBlockBounds(block);
      const sLeft = sensor.x - sensor.triggerWidth / 2;
      const sRight = sensor.x + sensor.triggerWidth / 2;
      const sTop = sensor.y - sensor.triggerHeight / 2;
      const sBottom = sensor.y + sensor.triggerHeight / 2;
      if (bounds.right >= sLeft && bounds.left <= sRight && bounds.bottom >= sTop && bounds.top <= sBottom) {
        triggered = true;
      }
    });
    sensorTriggers[sensor.variableId] = triggered;
  });

  return { blockTargets, sensorTriggers };
}
