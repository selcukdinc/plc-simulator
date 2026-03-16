import produce, { applyPatches, Patch } from "immer";
import * as TYPES from "./types";
import { INITIAL_DRAFT, SAMPLE_DRAFT } from "./const";
import { Diagram, Store } from "../interface";
import { addRung } from "../helpers/addRung";
import { assignParameter } from "../helpers/assignParameter";
import { findParrentRung } from "../helpers/simulationObjects";
import { cycleScan } from "../helpers/cycleScan";
import { deleteObject, reduceBranch } from "../helpers/deleteObject";
import { deleteVariable } from "../helpers/deleteVariable";
import { addVariable } from "../helpers/addVariable";
import addBranch from "../helpers/addBranch";

interface Change {
  redo: Patch[];
  undo: Patch[];
}
let currentVersion = -1;
let changes: Change[] = [];

const noOfVersionsSupported = 100;
const undoableActions = [
  TYPES.ADD_BRANCH,
  TYPES.ADD_ELEMENT,
  TYPES.ADD_RUNG,
  TYPES.ADD_VARIABLE,
  TYPES.ASSIGN_PARAMETER,
  TYPES.DELETE_OBJECT,
  TYPES.DELETE_VARIABLE,
  TYPES.SET_VAR_VALUE,

  TYPES.MOVE_OBJECT_DOWN,
  TYPES.MOVE_OBJECT_LEFT,
  TYPES.MOVE_OBJECT_RIGHT,
  TYPES.MOVE_OBJECT_UP,

  TYPES.DROP_BLOCK,
  TYPES.DROP_BRANCH,
  TYPES.DROP_RUNG,

  TYPES.SET_TYPE,
  TYPES.SET_VAR_NAME,
];
export default function (state = INITIAL_DRAFT, action: { type: string; payload: any }) {
  return produce(
    state,
    (draft: Store): Store | undefined => {
      if (undoableActions.includes(action.type)) {
        draft.temp.canUndo = true;
        draft.temp.canRedo = false;
        draft.temp.diagramSaved = false;
        window.history.replaceState({}, document.title, "/");
      }
      switch (action.type) {
        case TYPES.CYCLE_SCAN: {
          return cycleScan(draft);
        }
        case TYPES.ADD_BRANCH: {
          draft = addBranch(draft, draft.temp.selectedUuid);
          draft.temp.simulation = false;
          return;
        }
        case TYPES.ADD_ELEMENT: {
          const { block, blockId, dropRungId, dropIndex } = action.payload;
          const selectedUuid = draft.temp.selectedUuid;
          const parrentRungUuid = selectedUuid ? findParrentRung(selectedUuid, draft.rungs) : draft.runglist[0];
          const rungId = dropRungId ? dropRungId : parrentRungUuid;
          if (rungId) {
            const elements = draft.rungs[rungId]?.elements;
            const selectedIndex = elements.findIndex((element) => element === selectedUuid) + 1;
            const addIndex = dropIndex ? dropIndex : selectedIndex;
            elements.splice(addIndex, 0, blockId);
            draft.elements[blockId] = block;
            draft.temp.selectedUuid = blockId;
          }
          draft.temp.simulation = false;
          return;
        }
        case TYPES.ADD_RUNG: {
          const { dropIndex } = action.payload;
          draft.temp.simulation = false;
          return addRung(draft, dropIndex);
        }
        case TYPES.ADD_VARIABLE: {
          const { name, type, address } = action.payload;
          draft.variables = { ...draft.variables, ...addVariable(name, type, address) };
          return;
        }
        case TYPES.ASSIGN_PARAMETER: {
          const { index, type, variableUuid } = action.payload;
          draft.temp.simulation = false;
          return assignParameter(index, type, variableUuid, draft);
        }
        case TYPES.DELETE_OBJECT: {
          draft.temp.openElementProps = false;
          draft.temp.simulation = false;
          return deleteObject(draft.temp.selectedUuid, draft);
        }
        case TYPES.DELETE_VARIABLE: {
          const { uuid } = action.payload;
          draft.temp.simulation = false;
          return deleteVariable(uuid, draft);
        }
        case TYPES.MOVE_OBJECT_LEFT: {
          const objectUuid = draft.temp.selectedUuid;
          if (Object.keys(draft.elements).includes(objectUuid)) {
            const parrentRung = findParrentRung(objectUuid, draft.rungs);
            if (parrentRung) {
              const objectIndex = draft.rungs[parrentRung].elements.findIndex((element) => element === objectUuid);
              if (objectIndex > 0) {
                const removedElement = draft.rungs[parrentRung].elements.splice(objectIndex, 1)[0];
                draft.rungs[parrentRung].elements.splice(objectIndex - 1, 0, removedElement);
              }
            }
          }
          draft.temp.simulation = false;
          return;
        }
        case TYPES.MOVE_OBJECT_RIGHT: {
          const objectUuid = draft.temp.selectedUuid;
          if (Object.keys(draft.elements).includes(objectUuid)) {
            const parrentRung = findParrentRung(objectUuid, draft.rungs);
            if (parrentRung) {
              const objectIndex = draft.rungs[parrentRung].elements.findIndex((element) => element === objectUuid);
              if (objectIndex < draft.rungs[parrentRung].elements.length - 1) {
                const removedElement = draft.rungs[parrentRung].elements.splice(objectIndex, 1)[0];
                draft.rungs[parrentRung].elements.splice(objectIndex + 1, 0, removedElement);
              }
            }
          }
          draft.temp.simulation = false;
          return;
        }
        case TYPES.MOVE_OBJECT_DOWN: {
          const objectUuid = draft.temp.selectedUuid;
          if (Object.keys(draft.rungs).includes(objectUuid)) {
            if (draft.runglist.includes(objectUuid)) {
              const rungIndex = draft.runglist.findIndex((rung) => rung === objectUuid);
              if (rungIndex < draft.runglist.length - 1) {
                const removedRung = draft.runglist.splice(rungIndex, 1)[0];
                draft.runglist.splice(rungIndex + 1, 0, removedRung);
              }
            }
          }
          draft.temp.simulation = false;
          return;
        }
        case TYPES.MOVE_OBJECT_UP: {
          const objectUuid = draft.temp.selectedUuid;
          if (Object.keys(draft.rungs).includes(objectUuid)) {
            if (draft.runglist.includes(objectUuid)) {
              const rungIndex = draft.runglist.findIndex((rung) => rung === objectUuid);
              if (rungIndex > 0) {
                const removedRung = draft.runglist.splice(rungIndex, 1)[0];
                draft.runglist.splice(rungIndex - 1, 0, removedRung);
              }
            }
          }
          draft.temp.simulation = false;
          return;
        }
        case TYPES.DROP_BLOCK: {
          const { dragRungId, dragIndex, dropRungId, dropIndex } = action.payload;
          if (dragRungId && dragIndex !== undefined && dropRungId && dropIndex !== undefined) {
            const removedBlock = draft.rungs[dragRungId].elements.splice(dragIndex, 1)[0];
            draft.rungs[dropRungId].elements.splice(dropIndex, 0, removedBlock);
            reduceBranch(dragRungId, draft);
          }
          draft.temp.simulation = false;
          return;
        }
        case TYPES.DROP_BRANCH: {
          const { targetId } = action.payload;
          if (targetId) addBranch(draft, targetId);
          draft.temp.simulation = false;
          return;
        }
        case TYPES.DROP_RUNG: {
          const { dragRungId, dragIndex, dropIndex } = action.payload;
          if (dragRungId && dragIndex !== undefined && dropIndex !== undefined) {
            const removedRung = draft.runglist.splice(dragIndex, 1)[0];
            draft.runglist.splice(dropIndex, 0, removedRung);
          }
          draft.temp.simulation = false;
          return;
        }
        case TYPES.SELECT_OBJECT: {
          const { uuid } = action.payload;
          draft.temp.selectedUuid = uuid;
          return;
        }
        case TYPES.SET_CONFIGURED: {
          const { value } = action.payload;
          draft.elements[draft.temp.selectedUuid].configured = value;
          return;
        }
        case TYPES.SET_DISPLAY_TAB: {
          const { displayTab } = action.payload;
          draft.misc.displayTab = displayTab;
          return;
        }
        case TYPES.SET_ACTIVE_TAB: {
          draft.misc.activeTab = action.payload;
          return;
        }
        case TYPES.SET_DIAG_SAVED: {
          const { diagramSaved } = action.payload;
          draft.temp.diagramSaved = diagramSaved;
          return;
        }
        case TYPES.SET_SIMULATION: {
          const { value } = action.payload;
          draft.temp.simulation = value;
          if (!value) {
            Object.keys(draft.scene.blocks).forEach((blockId) => {
              draft.scene.blocks[blockId].targetX = draft.scene.blocks[blockId].x;
              draft.scene.blocks[blockId].targetY = draft.scene.blocks[blockId].y;
            });
            draft.temp.powerCircuitEnergized = new Set<string>();
          }
          return;
        }
        case TYPES.OPEN_ALERT_SNACKBAR: {
          draft.temp.alertSnackbar = action.payload;
          return;
        }
        case TYPES.CLOSE_ALERT_SNACKBAR: {
          draft.temp.alertSnackbar.open = false;
          return;
        }
        case TYPES.OPEN_ELEM_PROPERTIES: {
          draft.temp.openElementProps = action.payload;
          return;
        }
        case TYPES.SET_RUNG_COMMENT: {
          const { uuid, comment } = action.payload;
          if (draft.rungs[uuid]) {
            draft.rungs[uuid].comment = comment;
          }
          return;
        }
        case TYPES.SET_TYPE: {
          const { type } = action.payload;
          draft.elements[draft.temp.selectedUuid].type = type;
          return;
        }
        case TYPES.SET_VAR_NAME: {
          const { uuid, name } = action.payload;
          const variable = draft.variables[uuid];
          variable.name = name;
          Object.keys(variable.subVars).forEach((subVar) => {
            const subVarUuid = variable.subVars[subVar];
            draft.variables[subVarUuid].name = `${name}.${subVar}`;
          });
          return;
        }
        case TYPES.SET_VAR_VALUE: {
          const { uuid, value } = action.payload;
          const variable = draft.variables[uuid];
          variable.value = value;
          return;
        }
        case TYPES.ADD_CONTROL_ELEMENT: {
          const el = action.payload;
          draft.controlPanel.elements[el.id] = {
            id: el.id,
            type: el.elementType,
            label: el.label,
            x: el.x,
            y: el.y,
            variableId: null,
          };
          return;
        }
        case TYPES.REMOVE_CONTROL_ELEMENT: {
          delete draft.controlPanel.elements[action.payload.id];
          return;
        }
        case TYPES.UPDATE_CONTROL_ELEMENT: {
          const { id, patch } = action.payload;
          if (draft.controlPanel.elements[id]) {
            Object.assign(draft.controlPanel.elements[id], patch);
          }
          return;
        }
        case TYPES.CONTROL_BUTTON_PRESS: {
          const elem = draft.controlPanel.elements[action.payload.elementId];
          if (!elem || !elem.variableId) return;
          if (draft.variables[elem.variableId]) {
            draft.variables[elem.variableId].value = true;
          }
          return;
        }
        case TYPES.CONTROL_BUTTON_RELEASE: {
          const elem = draft.controlPanel.elements[action.payload.elementId];
          if (!elem || !elem.variableId) return;
          if (elem.type === 'PUSH_BUTTON' && draft.variables[elem.variableId]) {
            draft.variables[elem.variableId].value = false;
          }
          return;
        }
        case TYPES.TOGGLE_SWITCH_CLICK: {
          const elem = draft.controlPanel.elements[action.payload.elementId];
          if (!elem || !elem.variableId) return;
          if (draft.variables[elem.variableId]) {
            const current = draft.variables[elem.variableId].value;
            draft.variables[elem.variableId].value = !current;
          }
          return;
        }
        case TYPES.ADD_POWER_ELEMENT: {
          const { id, elementType, x, y, label } = action.payload;
          const terminalConfigs: Record<string, Array<{ side: 'in' | 'out'; index: number }>> = {
            POWER_SOURCE: [{ side: 'out', index: 0 }],
            CONTACTOR: [{ side: 'in', index: 0 }, { side: 'out', index: 0 }],
            THERMAL_RELAY: [{ side: 'in', index: 0 }, { side: 'out', index: 0 }],
            MOTOR: [{ side: 'in', index: 0 }],
            FUSE: [{ side: 'in', index: 0 }, { side: 'out', index: 0 }],
            TERMINAL_BLOCK: [{ side: 'in', index: 0 }, { side: 'in', index: 1 }, { side: 'out', index: 0 }, { side: 'out', index: 1 }],
          };
          const tConfigs = terminalConfigs[elementType] ?? [];
          const terminals = tConfigs.map((cfg, i) => ({
            id: `${id}-t${i}`,
            elementId: id,
            side: cfg.side,
            index: cfg.index,
          }));
          draft.powerCircuit.elements[id] = { id, type: elementType, label, x, y, rotation: 0, variableId: null, terminals };
          return;
        }
        case TYPES.REMOVE_POWER_ELEMENT: {
          const { id } = action.payload;
          const elem = draft.powerCircuit.elements[id];
          if (!elem) return;
          const terminalIds = new Set(elem.terminals.map((t) => t.id));
          Object.keys(draft.powerCircuit.cables).forEach((cableId) => {
            const cable = draft.powerCircuit.cables[cableId];
            if (terminalIds.has(cable.fromTerminalId) || terminalIds.has(cable.toTerminalId)) {
              delete draft.powerCircuit.cables[cableId];
            }
          });
          delete draft.powerCircuit.elements[id];
          return;
        }
        case TYPES.MOVE_POWER_ELEMENT: {
          const { id, x, y } = action.payload;
          if (draft.powerCircuit.elements[id]) {
            draft.powerCircuit.elements[id].x = x;
            draft.powerCircuit.elements[id].y = y;
          }
          return;
        }
        case TYPES.ADD_CABLE: {
          const { id, fromTerminalId, toTerminalId } = action.payload;
          const alreadyUsed = Object.values(draft.powerCircuit.cables).some(
            (c) => c.fromTerminalId === fromTerminalId || c.toTerminalId === fromTerminalId ||
                   c.fromTerminalId === toTerminalId || c.toTerminalId === toTerminalId
          );
          if (!alreadyUsed) {
            draft.powerCircuit.cables[id] = { id, fromTerminalId, toTerminalId };
          }
          return;
        }
        case TYPES.REMOVE_CABLE: {
          delete draft.powerCircuit.cables[action.payload.id];
          return;
        }
        case TYPES.SET_POWER_ELEMENT_VARIABLE: {
          const { elementId, variableId } = action.payload;
          if (draft.powerCircuit.elements[elementId]) {
            draft.powerCircuit.elements[elementId].variableId = variableId;
          }
          return;
        }
        case TYPES.ADD_SCENE_BLOCK: {
          const { id, blockType, x, y, label, speedPxPerSec } = action.payload;
          draft.scene.blocks[id] = {
            id, type: blockType, label, x, y, targetX: x, targetY: y,
            speedPxPerSec: speedPxPerSec ?? 100,
            minX: 0, maxX: 1000, minY: 0, maxY: 600,
            axes: { forwardVariableId: null, backwardVariableId: null },
          };
          return;
        }
        case TYPES.REMOVE_SCENE_BLOCK: {
          delete draft.scene.blocks[action.payload.id];
          return;
        }
        case TYPES.UPDATE_SCENE_BLOCK: {
          const { id, patch } = action.payload;
          if (draft.scene.blocks[id]) {
            Object.assign(draft.scene.blocks[id], patch);
          }
          return;
        }
        case TYPES.SET_SCENE_BLOCK_TARGET: {
          const { id, targetX, targetY } = action.payload;
          if (draft.scene.blocks[id]) {
            draft.scene.blocks[id].targetX = targetX;
            draft.scene.blocks[id].targetY = targetY;
          }
          return;
        }
        case TYPES.ADD_SENSOR_BLOCK: {
          const { id, sensorType, x, y, label, triggerWidth, triggerHeight } = action.payload;
          draft.scene.sensors[id] = {
            id, type: sensorType, label, x, y,
            triggerWidth: triggerWidth ?? 20,
            triggerHeight: triggerHeight ?? 20,
            variableId: null,
          };
          return;
        }
        case TYPES.REMOVE_SENSOR_BLOCK: {
          delete draft.scene.sensors[action.payload.id];
          return;
        }
        case TYPES.UPDATE_SENSOR_BLOCK: {
          const { id, patch } = action.payload;
          if (draft.scene.sensors[id]) {
            Object.assign(draft.scene.sensors[id], patch);
          }
          return;
        }
        case TYPES.UNDO:
          window.history.replaceState({}, document.title, "/");
          return produce(applyPatches(state, changes[currentVersion--].undo) as Store, (newDraft: Store) => {
            newDraft.temp.canUndo = currentVersion in changes;
            newDraft.temp.canRedo = true;
            newDraft.temp.diagramSaved = false;
            newDraft.temp.simulation = false;
          });
        case TYPES.REDO:
          window.history.replaceState({}, document.title, "/");
          return produce(applyPatches(state, changes[++currentVersion].redo) as Store, (newDraft: Store) => {
            newDraft.temp.canUndo = true;
            newDraft.temp.canRedo = currentVersion + 1 in changes;
            newDraft.temp.diagramSaved = false;
            newDraft.temp.simulation = false;
          });
        case TYPES.IMPORT_PROJECT: {
          const diagram = action.payload as Diagram;
          // Backward compat: eski JSON'larda comment alanı yoksa boş string ata
          Object.keys(diagram.rungs).forEach((rungId) => {
            if (diagram.rungs[rungId].comment === undefined) {
              diagram.rungs[rungId].comment = '';
            }
          });
          changes = [];
          currentVersion = -1;
          return {
            ...diagram,
            controlPanel: (diagram as any).controlPanel ?? { elements: {} },
            powerCircuit: (diagram as any).powerCircuit ?? { elements: {}, cables: {} },
            scene: (diagram as any).scene ?? { blocks: {}, sensors: {} },
            misc: {
              displayTab: "diagram",
              activeTab: 'LADDER' as const,
            },
            temp: {
              alertSnackbar: {
                color: "success",
                open: true,
                text: "Diagram successfully loaded from the database.",
              },
              canUndo: false,
              canRedo: false,
              diagramSaved: true,
              openElementProps: false,
              simulation: false,
              selectedUuid: "",
              powerCircuitEnergized: new Set<string>(),
            },
          };
        }
        case TYPES.LOAD_SAMPLE:
          changes = [];
          currentVersion = -1;
          return SAMPLE_DRAFT;

        case TYPES.LOAD_EMPTY:
          changes = [];
          currentVersion = -1;
          return INITIAL_DRAFT;

        default:
          return state;
      }
    },
    (patches, inversePatches) => {
      if (undoableActions.includes(action.type) && patches[0] && inversePatches[0]) {
        currentVersion++;
        changes[currentVersion] = {
          redo: patches,
          undo: inversePatches,
        };
        delete changes[currentVersion + 1];
        delete changes[currentVersion - noOfVersionsSupported];
      }
    }
  );
}
