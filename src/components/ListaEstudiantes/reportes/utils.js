import * as XLSX from 'xlsx-js-style';
// ----------------------------------------------------
// 🎯 AQUÍ VA LA DEFINICIÓN DEL ESTILO
// ----------------------------------------------------
const styleHeaderTable = {
  font: {
    bold: true,
    sz: 11, // Aumentado a 11 (asumiendo 10 como base por defecto)
    name: 'Calibri'
  },
  fill: {
    fgColor: { rgb: "DDEBF7" } // Azul muy suave (similar al Excel light blue)
  },
  alignment: {
    vertical: 'left',
    horizontal: 'center',
    wrapText: true
  },
  border: {
    top: { style: 'thin', color: { auto: 1 } },
    bottom: { style: 'thin', color: { auto: 1 } },
    left: { style: 'thin', color: { auto: 1 } },
    right: { style: 'thin', color: { auto: 1 } },
  }
};
// ----------------------------------------------------

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

  yPos += 5; // separación clara
  doc.setTextColor(108, 117, 125); // Gris elegante
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(normalizarTexto('Educacion Integral de Jóvenes y Adultos'), pageWidth / 2, yPos, { align: 'center' });

  yPos += 2; // separación clara
  // Línea separadora
  doc.setDrawColor(45, 65, 119);
  doc.setLineWidth(0.5);
  doc.line(40, yPos, pageWidth - 40, yPos);

  // Ya no se imprime título ni fecha aquí
  return yPos + 10; // Retorna la posición Y para continuar
};

// Función para exportar a Excel multiplataforma con ESTILOS
// Función para exportar a Excel multiplataforma con ESTILOS
export const exportarExcel = (datos, nombreBase, tituloReporte, extraHeaderRows = [], customMerges = []) => {
  try {
    // Crear workbook
    const wb = XLSX.utils.book_new();

    // Crear hoja con encabezado institucional
    const wsData = [
      ['CEIJA 5 La Calera - Cba'],
      ['Educación Integral de Jóvenes y Adultos'],
      [''],
      [tituloReporte], // Fila 3 (índice 3) -> Título principal del reporte
      [`Generado: ${new Date().toLocaleDateString('es-AR')} ${new Date().toLocaleTimeString('es-AR')}`],
      [''],
      ...datos // Los datos empiezan típicamente en la fila 6 (índice 6)
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Obtener el rango de celdas
    const range = XLSX.utils.decode_range(ws['!ref']);

    // Definir estilos base
    const borderStyle = {
      top: { style: 'thin', color: { rgb: "2D4177" } },
      bottom: { style: 'thin', color: { rgb: "2D4177" } },
      left: { style: 'thin', color: { rgb: "2D4177" } },
      right: { style: 'thin', color: { rgb: "2D4177" } }
    };

    // Estilo para el Título del Reporte (Fila 3) - Tamaño 12 solicitado
    const titleStyle = {
      font: { bold: true, color: { rgb: "2D4177" }, sz: 12, name: 'Calibri' },
      alignment: { horizontal: "center", vertical: "center" }
    };

    // Estilo para el Encabezado Institucional (Filas 0 y 1)
    const instStyle = {
      font: { bold: true, color: { rgb: "2D4177" }, sz: 14, name: 'Calibri' }, // Un poco más grande para el nombre inst.
      alignment: { horizontal: "center", vertical: "center" }
    };

    // Estilo para Encabezados de Tabla - Tamaño 11 solicitado
    const headerTableStyle = {
      font: { bold: true, color: { rgb: "2D4177" }, sz: 11, name: 'Calibri' }, // Tamaño 11
      fill: { fgColor: { rgb: "DDEBF7" } }, // Azul muy suave
      border: borderStyle,
      alignment: { horizontal: "center", vertical: "center", wrapText: true }
    };

    // Estilo para Datos Generales
    const dataStyle = {
      font: { sz: 10, name: 'Calibri' },
      border: borderStyle,
      alignment: { vertical: "center", horizontal: "center" } // Centrado por defecto para números
    };

    // Estilo para primera columna (generalmente etiquetas de fila) - Alineación izquierda
    const firstColStyle = {
      font: { sz: 10, name: 'Calibri' },
      border: borderStyle,
      alignment: { vertical: "center", horizontal: "left" }
    };

    // Aplicar estilos a las celdas
    for (let R = range.s.r; R <= range.e.r; ++R) {
      // Identificar si la fila es un encabezado de tabla
      // La primera fila de 'datos' (R=6) es siempre encabezado.
      const isMainHeader = (R === 6);
      const isExtraHeader = extraHeaderRows.includes(R - 6);
      const isHeaderRow = isMainHeader || isExtraHeader;

      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = { c: C, r: R };
        const cellRef = XLSX.utils.encode_cell(cellAddress);

        if (!ws[cellRef]) continue;

        // Aplicar estilos según la fila
        if (R === 0 || R === 1) {
          ws[cellRef].s = instStyle;
        } else if (R === 3) {
          ws[cellRef].s = titleStyle;
        } else if (isHeaderRow) {
          ws[cellRef].s = headerTableStyle;
        } else if (R > 6) {
          // Datos del cuerpo de la tabla
          if (C === 0) {
            ws[cellRef].s = firstColStyle; // Primera columna a la izquierda
          } else {
            ws[cellRef].s = dataStyle; // Resto centrado
          }
        }
      }
    }

    // Establecer anchos de columna dinámicos o fijos mejorados
    const maxCol = range.e.c;
    const colWidths = [];
    for (let i = 0; i <= maxCol; i++) {
      if (i === 0) colWidths.push({ wch: 35 }); // Primera columna ancha para etiquetas
      else colWidths.push({ wch: 20 }); // Columnas de datos uniformes
    }
    ws['!cols'] = colWidths;

    // Combinar celdas para el encabezado institucional
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: maxCol } }, // CEIJA 5
      { s: { r: 1, c: 0 }, e: { r: 1, c: maxCol } }, // Subtítulo
      { s: { r: 3, c: 0 }, e: { r: 3, c: maxCol } }, // Título del reporte
      { s: { r: 4, c: 0 }, e: { r: 4, c: maxCol } }, // Fecha
      ...customMerges // 🔹 Agregar merges personalizados aquí
    ];

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