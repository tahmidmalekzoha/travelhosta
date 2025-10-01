import { FunctionComponent, useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface TableEditorProps {
    onInsert: (tableText: string) => void;
    onClose: () => void;
}

/**
 * Visual table editor for creating tables in the admin panel
 */
const TableEditor: FunctionComponent<TableEditorProps> = ({ onInsert, onClose }) => {
    const [title, setTitle] = useState('');
    const [caption, setCaption] = useState('');
    const [headers, setHeaders] = useState<string[]>(['Column 1', 'Column 2', 'Column 3']);
    const [rows, setRows] = useState<string[][]>([
        ['Row 1, Cell 1', 'Row 1, Cell 2', 'Row 1, Cell 3'],
        ['Row 2, Cell 1', 'Row 2, Cell 2', 'Row 2, Cell 3']
    ]);

    const addColumn = () => {
        setHeaders([...headers, `Column ${headers.length + 1}`]);
        setRows(rows.map(row => [...row, '']));
    };

    const removeColumn = (colIndex: number) => {
        if (headers.length <= 1) {
            alert('Table must have at least one column');
            return;
        }
        setHeaders(headers.filter((_, i) => i !== colIndex));
        setRows(rows.map(row => row.filter((_, i) => i !== colIndex)));
    };

    const moveColumn = (fromIndex: number, toIndex: number) => {
        if (toIndex < 0 || toIndex >= headers.length) return;
        
        const newHeaders = [...headers];
        [newHeaders[fromIndex], newHeaders[toIndex]] = [newHeaders[toIndex], newHeaders[fromIndex]];
        setHeaders(newHeaders);

        const newRows = rows.map(row => {
            const newRow = [...row];
            [newRow[fromIndex], newRow[toIndex]] = [newRow[toIndex], newRow[fromIndex]];
            return newRow;
        });
        setRows(newRows);
    };

    const addRow = () => {
        setRows([...rows, Array(headers.length).fill('')]);
    };

    const removeRow = (rowIndex: number) => {
        if (rows.length <= 1) {
            alert('Table must have at least one row');
            return;
        }
        setRows(rows.filter((_, i) => i !== rowIndex));
    };

    const moveRow = (fromIndex: number, toIndex: number) => {
        if (toIndex < 0 || toIndex >= rows.length) return;
        
        const newRows = [...rows];
        [newRows[fromIndex], newRows[toIndex]] = [newRows[toIndex], newRows[fromIndex]];
        setRows(newRows);
    };

    const updateHeader = (index: number, value: string) => {
        const newHeaders = [...headers];
        newHeaders[index] = value;
        setHeaders(newHeaders);
    };

    const updateCell = (rowIndex: number, colIndex: number, value: string) => {
        const newRows = [...rows];
        newRows[rowIndex][colIndex] = value;
        setRows(newRows);
    };

    const generateTableText = () => {
        const attrs: string[] = [];
        if (title) attrs.push(`title="${title}"`);
        if (caption) attrs.push(`caption="${caption}"`);
        const attrString = attrs.length > 0 ? ` [${attrs.join(' ')}]` : '';

        const lines: string[] = [];
        lines.push(`:::table${attrString}`);
        lines.push(headers.join(' | '));
        lines.push('---');
        rows.forEach(row => lines.push(row.join(' | ')));
        lines.push(':::');

        return lines.join('\n');
    };

    const handleInsert = () => {
        onInsert(generateTableText());
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-[#1b3c44]">Table Editor</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Title and Caption */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Table Title (Optional)
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cd8453]"
                                placeholder="e.g., Price Comparison"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Caption (Optional)
                            </label>
                            <input
                                type="text"
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cd8453]"
                                placeholder="e.g., All prices in Taka"
                            />
                        </div>
                    </div>

                    {/* Table Editor */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Table Content
                            </label>
                            <div className="flex gap-2">
                                <button
                                    onClick={addColumn}
                                    className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    <Plus size={16} /> Column
                                </button>
                                <button
                                    onClick={addRow}
                                    className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    <Plus size={16} /> Row
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto border border-gray-300 rounded-lg">
                            <table className="w-full">
                                {/* Headers */}
                                <thead>
                                    <tr className="bg-[#1b3c44]">
                                        <th className="w-16 px-2 py-2"></th>
                                        {headers.map((header, colIndex) => (
                                            <th key={colIndex} className="px-2 py-2">
                                                <div className="space-y-2">
                                                    <input
                                                        type="text"
                                                        value={header}
                                                        onChange={(e) => updateHeader(colIndex, e.target.value)}
                                                        className="w-full px-2 py-1 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#cd8453]"
                                                    />
                                                    <div className="flex gap-1 justify-center">
                                                        <button
                                                            onClick={() => moveColumn(colIndex, colIndex - 1)}
                                                            className="p-1 text-white hover:bg-[#2d5560] rounded disabled:opacity-30"
                                                            disabled={colIndex === 0}
                                                            title="Move left"
                                                        >
                                                            <ArrowLeft size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => moveColumn(colIndex, colIndex + 1)}
                                                            className="p-1 text-white hover:bg-[#2d5560] rounded disabled:opacity-30"
                                                            disabled={colIndex === headers.length - 1}
                                                            title="Move right"
                                                        >
                                                            <ArrowRight size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => removeColumn(colIndex)}
                                                            className="p-1 text-red-300 hover:bg-red-600 rounded"
                                                            title="Delete column"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                {/* Data Rows */}
                                <tbody>
                                    {rows.map((row, rowIndex) => (
                                        <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                            <td className="px-2 py-2 border-r border-gray-300">
                                                <div className="flex flex-col gap-1">
                                                    <button
                                                        onClick={() => moveRow(rowIndex, rowIndex - 1)}
                                                        className="p-1 text-gray-600 hover:bg-gray-200 rounded disabled:opacity-30"
                                                        disabled={rowIndex === 0}
                                                        title="Move up"
                                                    >
                                                        <ArrowUp size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => moveRow(rowIndex, rowIndex + 1)}
                                                        className="p-1 text-gray-600 hover:bg-gray-200 rounded disabled:opacity-30"
                                                        disabled={rowIndex === rows.length - 1}
                                                        title="Move down"
                                                    >
                                                        <ArrowDown size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => removeRow(rowIndex)}
                                                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                                                        title="Delete row"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                            {row.map((cell, colIndex) => (
                                                <td key={colIndex} className="px-2 py-2 border-r border-gray-200 last:border-r-0">
                                                    <input
                                                        type="text"
                                                        value={cell}
                                                        onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#cd8453]"
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Preview */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preview
                        </label>
                        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                            {title && (
                                <h3 className="text-xl font-bold mb-4 text-center text-[#1b3c44]">
                                    {title}
                                </h3>
                            )}
                            <div className="overflow-x-auto bg-white rounded-lg shadow">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-[#1b3c44] text-white">
                                            {headers.map((header, index) => (
                                                <th key={index} className="px-4 py-3 text-left font-semibold border-r border-[#2d5560] last:border-r-0">
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row, rowIndex) => (
                                            <tr key={rowIndex} className={`${rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-[#f2eee9]`}>
                                                {row.map((cell, cellIndex) => (
                                                    <td key={cellIndex} className="px-4 py-3 border-r border-gray-200 last:border-r-0 text-gray-700">
                                                        {cell || <span className="text-gray-400 italic">Empty</span>}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {caption && (
                                <p className="text-center text-sm text-gray-600 italic mt-3">
                                    {caption}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleInsert}
                        className="px-6 py-2 bg-[#cd8453] text-white rounded-lg hover:bg-[#1b3c44]"
                    >
                        Insert Table
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TableEditor;
