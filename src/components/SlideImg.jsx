import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Importar los estilos del carrusel
import { Carousel } from 'react-responsive-carousel';

const SlideImg = () => {
    return (
        <Carousel
            showArrows={true}
            autoPlay={true}
            infiniteLoop={true}
            showThumbs={false}
            showStatus={false}
            interval={3000}
            className="carousel-container" // Clase CSS para el contenedor del carrusel
        >
            <div> 
                <img src="src\assets\ce5n.png" alt="Imagen 1" className="carousel-image" /> 
            </div> 
            <div> 
                <img src="src\assets\ce5n.png" alt="Imagen 2" className="carousel-image" /> 
            </div> 
            <div> 
                <img src="src\assets\ce5n.png" alt="Imagen 1" className="carousel-image" /> 
            </div> 
        </Carousel>
    );
}

export default SlideImg;
