import './alerta.css';

function AlertaMens(props) {
    const { text, variant } = props;

    // Asigna una clase basada en el tipo de alerta (success, error, etc.)
    const alertaClass = `${classes.alerta} ${classes[variant]}`;
    console.log("Renderizando alerta:", { text, variant }); // Verifica las props
    return (
        <div className={alertaClass}>
            {text}
        </div>
    );
}
export default AlertaMens;
