import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const Banner = () => {
    const [banners, setBanners] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await axios.get(`${API_URL}/banners/active`);
                setBanners(res.data);
            } catch (error) {
                console.error("Error fetching banners:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBanners();
    }, []);

    // Auto-slide effect
    useEffect(() => {
        if (banners.length <= 1) return;
        
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval);
    }, [banners.length]);

    const nextSlide = () => {
        setCurrentSlide(currentSlide === banners.length - 1 ? 0 : currentSlide + 1);
    };

    const prevSlide = () => {
        setCurrentSlide(currentSlide === 0 ? banners.length - 1 : currentSlide - 1);
    };

    if (loading) {
        return <div className="h-[400px] bg-gray-200 animate-pulse rounded-2xl mx-4 mt-6"></div>;
    }

    if (banners.length === 0) {
        // Fallback static banner if no active banners exist
        return (
            <section className="container mx-auto px-4 py-6">
                <div className="relative rounded-2xl overflow-hidden shadow-lg h-[400px]">
                    <img
                        src="https://placehold.co/800x400/2563eb/ffffff?text=Default+Banner"
                        alt="Default Banner"
                        className="w-full h-full object-cover"
                    />
                </div>
            </section>
        );
    }

    return (
        <section className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-auto md:h-[400px]">
                {/* Main Slider Area */}
                <div className="md:col-span-8 relative rounded-2xl overflow-hidden shadow-lg group">
                    {banners.map((banner, index) => (
                        <div 
                            key={banner._id}
                            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                        >
                            <img
                                src={banner.image_url}
                                alt={banner.title || "Banner"}
                                className="w-full h-full object-cover"
                            />
                            {/* Overlay Content */}
                            {(banner.title || banner.subtitle) && (
                                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center p-8 text-white">
                                    {banner.subtitle && (
                                        <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">
                                            {banner.subtitle}
                                        </span>
                                    )}
                                    {banner.title && (
                                        <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight max-w-lg">
                                            {banner.title}
                                        </h2>
                                    )}
                                    {banner.link_to && (
                                        <a href={banner.link_to} className="bg-white text-blue-600 px-6 py-3 rounded-full font-bold hover:bg-blue-50 transition w-fit inline-block mt-4">
                                            Mua ngay
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Navigation Buttons (Only if > 1 slide) */}
                    {banners.length > 1 && (
                        <>
                            <button 
                                onClick={prevSlide}
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button 
                                onClick={nextSlide}
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                            >
                                <ChevronRight size={24} />
                            </button>
                            
                            {/* Indicators */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                                {banners.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentSlide(idx)}
                                        className={`w-2 h-2 rounded-full transition-all ${idx === currentSlide ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Side Static Banners (Optional - hardcoded or fetched separately) */}
                <div className="md:col-span-4 flex flex-col gap-4 h-full hidden md:flex">
                    <div className="flex-1 rounded-2xl overflow-hidden shadow-md relative cursor-pointer group">
                        <img src="https://placehold.co/400x200/db2777/ffffff?text=Gia+Dung+Bep" alt="Sub 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 rounded-2xl overflow-hidden shadow-md relative cursor-pointer group">
                        <img src="https://placehold.co/400x200/16a34a/ffffff?text=Smart+Home" alt="Sub 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;