import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { ProfileBalanceCard } from '../components/ProfileBalanceCard';
import type { ServiceItem, Banner } from '../types';
import { apiService } from '../services/api';

export const Home: React.FC = () => {
  const { setActiveTab, setSelectedService } = useAuth();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const bannerScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, bannersRes] = await Promise.all([
          apiService.getServices(),
          apiService.getBanners(),
        ]);
        if (servicesRes.data) setServices(servicesRes.data);
        if (bannersRes.data) setBanners(bannersRes.data);
      } catch (e) {
        console.error('Error fetching home data:', e);
      }
    };
    fetchData();
  }, []);

  const handleSelectService = (service: ServiceItem) => {
    setSelectedService(service);
    setActiveTab('payment');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-5 sm:py-8 space-y-7 sm:space-y-10">
      {/* Profile & Saldo Card */}
      <ProfileBalanceCard />

      {/* Services Grid (matching page 6) */}
      <section className="w-full pt-1 sm:pt-4">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-6 lg:grid-cols-12 gap-y-4 sm:gap-y-6 gap-x-1.5 xs:gap-x-2 sm:gap-x-4">
          {services.map((service) => (
            <button
              key={service.service_code}
              onClick={() => handleSelectService(service)}
              className="flex flex-col items-center group focus:outline-none transition-all active:scale-95 hover:-translate-y-1 cursor-pointer py-1"
            >
              <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 flex items-center justify-center p-2 rounded-xl bg-gray-50/70 sm:bg-transparent group-hover:bg-gray-100/70 transition-colors">
                <img
                  src={service.service_icon}
                  alt={service.service_name}
                  className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 object-contain drop-shadow-xs"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/Listrik.png';
                  }}
                />
              </div>
              <span className="text-[10px] xs:text-[11px] sm:text-xs text-center text-gray-700 font-medium mt-1 leading-tight max-w-[68px] xs:max-w-[76px] sm:max-w-[80px] break-words line-clamp-2">
                {service.service_name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Promotional Banners (matching page 6) */}
      <section className="w-full pt-2 sm:pt-4">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-sm sm:text-lg font-bold text-gray-800">
            Temukan promo menarik
          </h2>
          <span className="text-[11px] text-gray-400 font-normal sm:hidden">
            Geser →
          </span>
        </div>

        <div
          ref={bannerScrollRef}
          className="flex gap-3 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-3 select-none -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {banners.map((banner, index) => (
            <div
              key={index}
              className="flex-shrink-0 snap-start w-[76vw] max-w-[280px] sm:w-72 md:w-80 rounded-xl overflow-hidden hover:opacity-95 transition-opacity cursor-pointer shadow-xs hover:shadow"
            >
              <img
                src={banner.banner_image}
                alt={banner.banner_name}
                className="w-full h-auto object-cover rounded-xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `/assets/Banner ${(index % 5) + 1}.png`;
                }}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
