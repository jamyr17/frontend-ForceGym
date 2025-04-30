import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Testimonials = () => {
  const testimonials = [
    { name: "Carlos M.", text: "¡El mejor gimnasio de la ciudad!", img: "/client1.jpg" },
    { name: "Ana L.", text: "Los entrenadores son increíbles.", img: "/client2.jpg" },
    { name: "Juan P.", text: "He logrado mis metas en 3 meses.", img: "/client3.jpg" },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

  return (
    <section className="py-20 bg-black text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          NUESTROS <span className="text-gold">CLIENTES</span>
        </h2>
        <Slider {...settings}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="px-4">
              <div className="bg-black p-8 rounded-lg text-center border border-gold">
                <img 
                  src={testimonial.img} 
                  alt={testimonial.name} 
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-gold" 
                />
                <p className="text-xl italic mb-4">
                  "{testimonial.text}"
                </p>
                <p className="font-bold text-gold">{testimonial.name}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Testimonials;
