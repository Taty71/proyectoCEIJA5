import * as XLSX from 'xlsx';

// Función para normalizar texto a caracteres compatibles con jsPDF
export const normalizarTexto = (texto) => {
  if (!texto) return '';
  return texto
    .replace(/á/g, 'a').replace(/Á/g, 'A')
    .replace(/é/g, 'e').replace(/É/g, 'E')
    .replace(/í/g, 'i').replace(/Í/g, 'I')
    .replace(/ó/g, 'o').replace(/Ó/g, 'O')
    .replace(/ú/g, 'u').replace(/Ú/g, 'U')
    .replace(/ñ/g, 'n').replace(/Ñ/g, 'N')
    .replace(/ü/g, 'u').replace(/Ü/g, 'U');
};

// Funciones para control de páginas y pie de página
export const crearControlPaginas = (doc) => {
  let numeroPagina = 1;
  
  const agregarPiePagina = () => {
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100); // Gris
    doc.text(`Página ${numeroPagina}`, 297, 820, { align: 'center' }); // Centrado en A4 (595/2 = 297)
    doc.text(`Generado: ${new Date().toLocaleString('es-ES')}`, 20, 820);
    numeroPagina++;
  };
  
  const verificarEspacio = (doc, yPos, espacioNecesario) => {
    if (yPos + espacioNecesario > 780) { // A4: 842 puntos total - 60 puntos para pie = 780
      agregarPiePagina();
      doc.addPage();
      return 40; // Nuevo yPos con margen superior
    }
    return yPos;
  };
  
  return { agregarPiePagina, verificarEspacio };
};

// Función para crear encabezados institucionales
export const crearEncabezadoInstitucional = (doc, tituloReporte) => {
  const pageWidth = doc.internal.pageSize.width;
  let yPos = 28; // Más separado del borde superior

  // Encabezado institucional (más pequeño)
  doc.setTextColor(45, 65, 119); // Azul institucional
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('CEIJA 5 La Calera - Cba', pageWidth / 2, yPos, { align: 'center' });

  yPos += 10; // separación clara
  doc.setTextColor(108, 117, 125); // Gris elegante
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(normalizarTexto('Educacion Integral para Jovenes y Adultos'), pageWidth / 2, yPos, { align: 'center' });

  yPos += 10; // separación clara
  // Línea separadora
  doc.setDrawColor(45, 65, 119);
  doc.setLineWidth(0.5);
  doc.line(40, yPos, pageWidth - 40, yPos);

  // Ya no se imprime título ni fecha aquí
  return yPos + 10; // Retorna la posición Y para continuar
};

// Función para exportar a Excel multiplataforma
export const exportarExcel = (datos, nombreBase, tituloReporte) => {
  try {
    // Crear workbook
    const wb = XLSX.utils.book_new();
    
    // Crear hoja con encabezado institucional
    const wsData = [
      ['CEIJA 5 La Calera - Cba'],
      ['Educación Integral para Jóvenes y Adultos'],
      [''],
      [tituloReporte],
      [`Generado: ${new Date().toLocaleDateString('es-AR')} ${new Date().toLocaleTimeString('es-AR')}`],
      [''],
      ...datos
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Configurar estilos con rayado alternado
    const numCols = datos[0]?.length || 4;
    const maxCol = Math.max(numCols - 1, 3);

    // Establecer anchos de columna optimizados
    const colWidths = [];
    for (let i = 0; i <= maxCol; i++) {
      if (i === 0) colWidths.push({ wch: 25 }); // Primera columna más ancha
      else colWidths.push({ wch: 18 }); // Otras columnas
    }
    ws['!cols'] = colWidths;

    // Combinar celdas para el encabezado institucional
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: maxCol } }, // CEIJA 5
      { s: { r: 1, c: 0 }, e: { r: 1, c: maxCol } }, // Subtítulo
      { s: { r: 3, c: 0 }, e: { r: 3, c: maxCol } }, // Título del reporte
      { s: { r: 4, c: 0 }, e: { r: 4, c: maxCol } }  // Fecha
    ];

    // Estilos: azul oscuro y negrita para encabezado y títulos
    const azulOscuro = { rgb: '2D4177' };
    // Encabezado institucional
    ws['A1'].s = { font: { bold: true, color: azulOscuro, sz: 11 } };
    ws['A2'].s = { font: { bold: true, color: azulOscuro, sz: 11 } };
    // Título del reporte
    ws[`A4`].s = { font: { bold: true, color: azulOscuro, sz: 14 } };
    // Títulos de columnas (fila 7, índice 6)
    for (let c = 0; c <= maxCol; c++) {
      const col = String.fromCharCode(65 + c); // A, B, C...
      const cell = `${col}7`;
      if (ws[cell]) ws[cell].s = { font: { bold: true, color: azulOscuro, sz: 11 } };
    }
    
    // Agregar hoja al workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
    
    // Generar el archivo
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Crear enlace de descarga
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${nombreBase}_${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    return true;
  } catch (error) {
    console.error('Error al generar Excel:', error);
    return false;
  }
};

// Función para calcular porcentajes
export const calcularPorcentaje = (parte, total) => {
  if (total === 0) return '0.0';
  return ((parte / total) * 100).toFixed(1);
};