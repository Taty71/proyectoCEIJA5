export function formatearFecha(fecha) {
    if (!fecha) return '';
    const d = new Date(fecha);
    if (isNaN(d)) return '';
    return d.toLocaleDateString('es-AR');
}