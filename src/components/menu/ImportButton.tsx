import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { IMPORT_PROJECT, OPEN_ALERT_SNACKBAR } from '../../store/types';
import { ReactComponent as SvgFileUpload } from '../../svg/fileUpload.svg';
import SvgButton from '../SvgButton';

const REQUIRED_KEYS = ['branches', 'elements', 'runglist', 'rungs', 'variables'];

const ImportButton: React.FC = () => {
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const diagram = JSON.parse(event.target?.result as string);
        const isValid = REQUIRED_KEYS.every((key) => key in diagram);
        if (!isValid) throw new Error('Missing required keys');
        dispatch({ type: IMPORT_PROJECT, payload: diagram });
      } catch {
        dispatch({
          type: OPEN_ALERT_SNACKBAR,
          payload: { color: 'error', open: true, text: 'Invalid file. Please select a valid PLC diagram JSON file.' },
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <>
      <input ref={inputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleFileChange} />
      <SvgButton onClick={() => inputRef.current?.click()} Svg={SvgFileUpload} />
    </>
  );
};

export default ImportButton;
