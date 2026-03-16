import { AlertColor } from '@mui/material';

export interface Branch {
  rungs: string[];
  input: boolean;
  out: boolean;
}
export interface Diagram {
  branches: {
    [key: string]: Branch;
  };
  runglist: string[];
  elements: Elements;
  rungs: { [key: string]: Rung };
  variables: { [key: string]: Variable };
}
export interface Element {
  configured: boolean;
  out: boolean;
  parameters: ElementParameters;
  type: string;
}
export interface Elements {
  [key: string]: ElementCoil | ElementCompare | ElementContact | ElementCounter | ElementGate | ElementMath | ElementMove | ElementTimer;
}
export type ElementsAll = ElementCoil | ElementCompare | ElementContact | ElementCounter | ElementGate | ElementMath | ElementMove | ElementTimer;
export interface ElementCoil extends Element {
  type: CoilType;
}
export interface ElementCompare extends Element {
  type: CompareType;
}
export interface ElementContact extends Element {
  type: ContactType;
  memInput: boolean;
}
export interface ElementCounter extends Element {
  memInput: boolean;
  prevCU: boolean;
  prevCD: boolean;
  type: CounterType;
}
export interface ElementGate extends Element {
  type: GateType;
}
export interface ElementMath extends Element {
  type: MathType;
}
export interface ElementMove extends Element {
  type: MoveType;
}
export interface ElementParameter {
  type: string[];
  uuid: string;
}
export interface ElementParameters {
  [key: string]: ElementParameter[];
}
export interface ElementTimer extends Element {
  type: TimerType;
}
export interface Rung {
  comment: string;
  elements: string[];
  input: boolean;
  out: boolean;
}

export type Rungs = {
  [key: string]: Rung;
};

// New panel types
export type ControlElementType = 'PUSH_BUTTON' | 'TOGGLE_SWITCH' | 'PILOT_LAMP' | 'EMERGENCY_STOP';
export type PowerElementType = 'POWER_SOURCE' | 'CONTACTOR' | 'THERMAL_RELAY' | 'MOTOR' | 'FUSE' | 'TERMINAL_BLOCK';
export type SceneBlockType = 'CRANE_TROLLEY' | 'CRANE_HOOK' | 'CONVEYOR' | 'PNEUMATIC_CYL' | 'LIFT_TABLE' | 'SIGNAL_TOWER';
export type SensorType = 'LIMIT_SWITCH' | 'PHOTOELECTRIC' | 'PROXIMITY';
export type AppTab = 'LADDER' | 'CONTROL_PANEL' | 'POWER_CIRCUIT' | 'SCENE';

export interface ControlElement {
  id: string;
  type: ControlElementType;
  label: string;
  x: number;
  y: number;
  variableId: string | null;
}
export interface ControlPanel {
  elements: { [id: string]: ControlElement };
}

export interface Terminal {
  id: string;
  elementId: string;
  side: 'in' | 'out';
  index: number;
}
export interface PowerElement {
  id: string;
  type: PowerElementType;
  label: string;
  x: number;
  y: number;
  rotation: 0 | 90 | 180 | 270;
  variableId: string | null;
  terminals: Terminal[];
}
export interface Cable {
  id: string;
  fromTerminalId: string;
  toTerminalId: string;
}
export interface PowerCircuit {
  elements: { [id: string]: PowerElement };
  cables: { [id: string]: Cable };
}

export interface SceneBlockAxes {
  forwardVariableId: string | null;
  backwardVariableId: string | null;
}
export interface SceneBlock {
  id: string;
  type: SceneBlockType;
  label: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speedPxPerSec: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  axes: SceneBlockAxes;
  signalVariableId?: string | null;
}
export interface SensorBlock {
  id: string;
  type: SensorType;
  label: string;
  x: number;
  y: number;
  triggerWidth: number;
  triggerHeight: number;
  variableId: string | null;
}
export interface Scene {
  blocks: { [id: string]: SceneBlock };
  sensors: { [id: string]: SensorBlock };
}

export interface Store extends Diagram {
  controlPanel: ControlPanel;
  powerCircuit: PowerCircuit;
  scene: Scene;
  misc: { displayTab: string; activeTab: AppTab };
  temp: {
    alertSnackbar: { color: AlertColor; open: boolean; text: string };
    canUndo: boolean;
    canRedo: boolean;
    diagramSaved: boolean;
    openElementProps: boolean;
    simulation: boolean;
    selectedUuid: string;
    powerCircuitEnergized: Set<string>;
  };
}

export interface Variable {
  address?: string;
  name: string;
  parrent: string;
  subVars: { [key: string]: string };
  type: string;
  usedBy: string[];
  value: boolean | number | null;
}
export interface VariableOption {
  label: string;
  value: string;
}

export type GateType = 'NOT' | 'AND' | 'OR' | 'NAND' | 'NOR';
export type CounterType = 'CTU' | 'CTD' | 'CTUD';
export type CoilType = 'OTE' | 'OTL' | 'OTU' | 'OTN';
export type ContactType = 'XIC' | 'XIO' | 'OSP' | 'OSN';
export type CompareType = 'EQU' | 'NEQ' | 'GRT' | 'GEQ' | 'LES' | 'LEQ';
export type MathType = 'ADD' | 'SUB' | 'MUL' | 'DIV';
export type TimerType = 'TOF' | 'TON' | 'TONR';
export type MoveType = 'MOV' | 'MOVE';

export type FbParam = { desc: string; varName?: string; isRequired?: boolean; value: boolean | number | null };
export type FbParams = (FbParam | null)[];

export type ElementDropResult = { type: string; dropId: string; dropIndex: number; dropRungId: string };
export type RungDropResult = { dropIndex: number };
