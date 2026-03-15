import { store } from '../../store/store';
import { Store } from '../../interface';
import { ReactComponent as SvgFileDownload } from '../../svg/fileDownload.svg';
import SvgButton from '../SvgButton';

const ExportButton: React.FC = () => {
  const handleExport = () => {
    const state = store.getState() as unknown as Store;
    const { branches, elements, runglist, rungs, variables } = state;
    const diagram = { branches, elements, runglist, rungs, variables };

    const blob = new Blob([JSON.stringify(diagram, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plc-diagram-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return <SvgButton onClick={handleExport} Svg={SvgFileDownload} title="Dışa Aktar (JSON)" />;
};

export default ExportButton;
