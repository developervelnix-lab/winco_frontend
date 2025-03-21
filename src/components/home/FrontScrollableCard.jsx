import { Carousel } from 'flowbite-react';
import React from 'react';

function FrontScrollableCard() {
  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg">
      <Carousel className="h-40 sm:h-56 md:h-64 lg:h-72 xl:h-80 2xl:h-96">
        <div className="relative w-full h-full">
          <img
            className="w-full h-full object-cover object-center"
            src="https://ossimg.tirangaagent.com/Tiranga/banner/Banner_20240413193953ktmm.png"
            alt="Banner slide 1"
          />
        </div>
        <div className="relative w-full h-full">
          <img
            className="w-full h-full object-cover object-center"
            src="https://ossimg.tirangaagent.com/Tiranga/banner/Banner_20240413193953ktmm.png"
            alt="Banner slide 2"
          />
        </div>
        <div className="relative w-full h-full">
          <img
            className="w-full h-full object-cover object-center"
            src="https://ossimg.tirangaagent.com/Tiranga/banner/Banner_20240413193953ktmm.png"
            alt="Banner slide 3"
          />
        </div>
        <div className="relative w-full h-full">
          <img
            className="w-full h-full object-cover object-center"
            src="https://ossimg.tirangaagent.com/Tiranga/banner/Banner_20240413193953ktmm.png"
            alt="Banner slide 4"
          />
        </div>
      </Carousel>
    </div>
  );
}

export default FrontScrollableCard;