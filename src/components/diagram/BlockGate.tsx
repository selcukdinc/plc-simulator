import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { ELEMENT, OUT_ON } from '../../consts/colors';
import { GATE_NOT } from '../../consts/elementTypes';
import { CONTACT_HEIGHT, CONTACT_SYMBOL_WIDTH, MID_CELL_HEIGHT } from '../../consts/blockDimensions';
import { GateType, ElementParameters, Store } from '../../interface';
import BlockVariableName from './block-components/BlockVarName';
import MiddleLineBox from './block-components/MiddleLineBox';

interface Props {
  fill: string;
  parameters: ElementParameters;
  type: GateType;
}

export default function BlockGate({ fill, parameters, type }: Props) {
  const input0ID = parameters?.input[0]?.uuid;
  const input1ID = parameters?.input[1]?.uuid;
  const variable0 = useSelector((state: Store) => state.variables[input0ID]);
  const variable1 = useSelector((state: Store) => state.variables[input1ID]);
  const simulation = useSelector((state: Store) => state.temp.simulation);
  const elementOut = useSelector((state: Store) => {
    // For NOT: track element.out directly to colour the wire correctly
    const el = Object.values(state.elements).find((e) => e.parameters === parameters);
    return el?.out ?? false;
  });

  const isNot = type === GATE_NOT;

  const gateFill = (() => {
    if (!simulation) return fill;
    if (isNot) return elementOut ? OUT_ON : ELEMENT;
    const a = variable0?.value;
    const b = variable1?.value;
    if (typeof a !== 'boolean') return fill;
    switch (type) {
      case 'AND':  return (a && b)  ? OUT_ON : ELEMENT;
      case 'OR':   return (a || b)  ? OUT_ON : ELEMENT;
      case 'NAND': return !(a && b) ? OUT_ON : ELEMENT;
      case 'NOR':  return !(a || b) ? OUT_ON : ELEMENT;
      default:     return fill;
    }
  })();

  const symbolText = isNot ? '!' : type;
  const symbolFontSize = !isNot && (type === 'NAND' || type === 'NOR') ? '0.75em' : '1.1em';

  // NOT: same 3-row grid as BlockContact (rows 1+2 empty) so the wire sits at row 3
  // 2-input gates: 4 rows — var name above (row 2), wire (row 3), var name below (row 4)
  const gridRows = isNot
    ? `1em 1.5em ${MID_CELL_HEIGHT}`
    : `1em 1.5em ${MID_CELL_HEIGHT} 1.5em`;

  return (
    <Box
      sx={{
        display: 'inline-grid',
        gridTemplateColumns: 'min-content minmax(min-content, 2.5em) min-content',
        gridTemplateRows: gridRows,
      }}
    >
      {/* Row 2: top variable name (2-input gates only) */}
      {!isNot && (
        <BlockVariableName columnStart={1} columnEnd={4} row={2} name={variable0?.name} />
      )}

      {/* Row 3: wire + gate symbol box + wire — same row for ALL gate types */}
      <MiddleLineBox color={gateFill} columnStart={1} columnEnd={2} row={3} />
      <Box
        sx={{
          gridColumn: 2,
          gridRow: 3,
          height: CONTACT_HEIGHT,
          width: '2.5em',
          border: `solid ${CONTACT_SYMBOL_WIDTH} ${gateFill}`,
          marginTop: `calc((${MID_CELL_HEIGHT} - ${CONTACT_HEIGHT})/2)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
        }}
      >
        <Box
          component="span"
          sx={{
            color: gateFill,
            fontSize: symbolFontSize,
            fontWeight: 'bold',
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          {symbolText}
        </Box>
      </Box>
      <MiddleLineBox color={gateFill} columnStart={3} columnEnd={4} row={3} />

      {/* Row 4: bottom variable name (2-input gates only) */}
      {!isNot && (
        <BlockVariableName columnStart={1} columnEnd={4} row={4} name={variable1?.name} />
      )}
    </Box>
  );
}
