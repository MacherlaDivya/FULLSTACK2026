import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const downloadBlob = (content, fileName, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  window.URL.revokeObjectURL(url);
};

const exportRowsToCsv = (rows, fileName = 'report.csv') => {
  if (!rows?.length) {
    return;
  }

  const headers = Object.keys(rows[0]);
  const lines = [headers.join(',')];

  rows.forEach((row) => {
    const line = headers
      .map((header) => {
        const value = row[header] ?? '';
        return `"${String(value).replaceAll('"', '""')}"`;
      })
      .join(',');
    lines.push(line);
  });

  downloadBlob(lines.join('\n'), fileName, 'text/csv;charset=utf-8;');
};

const exportSummaryToPdf = ({ title, summary = [], tableRows = [], fileName = 'report.pdf' }) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(title, 14, 20);
  doc.setFontSize(11);

  summary.forEach((item, index) => {
    doc.text(`${item.label}: ${item.value}`, 14, 32 + index * 7);
  });

  if (tableRows.length) {
    autoTable(doc, {
      startY: 42 + summary.length * 7,
      head: [Object.keys(tableRows[0])],
      body: tableRows.map((row) => Object.values(row)),
      styles: {
        fontSize: 9,
      },
      headStyles: {
        fillColor: [13, 148, 136],
      },
    });
  }

  doc.save(fileName);
};

export { exportRowsToCsv, exportSummaryToPdf };
