import "swiper/swiper-bundle.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { Sprout, Users, FileText, Globe } from "lucide-react";
import { motion } from "framer-motion";
import img from './../../assets/purepng.com-brinjalvegetables-brinjal-eggplant-melongene-garden-egg-guinea-squash-941524725891tf1xf.png'
import slide from "../../assets/image 1.png";
import img2 from './../../assets/potato.jpg';
import img3 from './../../assets/pumpking2.png';
import img4 from './../../assets/carbage.png';
import {useTranslation} from 'react-i18next';
import { Link } from "react-router-dom";
import video from "../../assets/Video Banner Stock Videos - Rural, Farming, Agriculture, Nature.mp4";

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
};


export default function Home() {
//translation part
const { t, i18n } = useTranslation();
const isSinhala = i18n.language === "si";

  return (
    <div className={`w-screen overflow-x-hidden ${isSinhala ? "font-sinhala text-2xl" : "font-sans"} text-gray-900`}>
      <section className="h-[80vh] md:h-[90vh] relative">
        <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectFade]}
            effect="fade"
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="h-full"
          >
          {[
            {
              img: slide,
              title: t('Empowering Farmers,\nConnecting Markets'),
              subtitle:
                t('Local exchange members spread ideas for organic agriculture and fair market sharing connecting rural farmers to thriving markets'),
            },
            {
              img: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1600',
              title: t('Sustainable Farming\nMeets Technology'),
              subtitle: t('Building a greener future with smart solutions for modern farms'),
            },
            {
              img: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1600",
              title: t('From Field to Market,\nWe Stand With Farmers'),
              subtitle: t('Better pricing, better prediction, and less wastage with data-driven tools'),
            },
          ].map((slide, idx) => (
            <SwiperSlide key={idx} className="relative">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(rgba(2,6,23,0.45), rgba(2,6,23,0.45)), url('${slide.img}')`,
                }}
              />

              <div className="relative z-10 h-full flex items-center">
                <div className="max-w-3xl mx-auto px-6 text-center text-white">
                  <motion.h1
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight"
                  >
                    {slide.title.split('\n').map((line, i) => (
                      <span key={i} className="block">
                        {line}
                      </span>
                    ))}
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="mt-6 text-sm sm:text-base md:text-lg text-white/90 max-w-2xl mx-auto"
                  >
                    {slide.subtitle}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="mt-8 flex justify-center gap-4 flex-col sm:flex-row"
                  >
                    <button className="rounded-md bg-custom-green text-white hover:bg-green-800 shadow-md px-6 py-3  font-medium w-full sm:w-auto">
                      {t('getStarted')}
                    </button>
                    <button className="border border-white px-6 py-3 rounded text-white hover:bg-white hover:text-[#0f6b53] w-full sm:w-auto">
                      {t('learnMore')}
                    </button>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
      </section>

      {/* PASSION / INTRO */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl lg:text-4xl font-bold text-custom-green">
              {t('Our Passion for Agriculture')}
              <span className="block">{t('Nurturing Growth and Sustaining the Future')}</span>
            </motion.h2>

            <motion.p variants={fadeUp} className="mt-4 text-gray-600 leading-relaxed">
              {t('Li European linguas es membres del sam familie. Lor separat existentie es un myth. Por scientie, musica, sport etc.')}
            </motion.p>

            <motion.button variants={fadeUp} className="mt-6 rounded-md bg-custom-green text-white hover:bg-green-800 shadow-md px-6 py-3">
              {t('getStarted')}
            </motion.button>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1000"
                alt="field"
                className="w-full h-64 md:h-80 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-4 -right-4 bg-white px-4 py-2 rounded-lg shadow">
                <p className="text-[#0f6b53] font-bold">Since 2025</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SERVICES ICONS */}
      <section className="py-8 md:py-12 bg-gray-50 relative overflow-hidden">

        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src={video} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/30 z-0"></div>

        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-8">
            {t('Our services')}
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
            {[{
              icon: Sprout,
              title: t('Predict Price Before you Sell'),
            }, {
              icon: Users,
              title: t('Consultant Services for Crops'),
            }, {
              icon: FileText,
              title: t('Reduce Wastage of Harvest'),
            }, {
              icon: Globe,
              title: t('Create Global Market Place'),
            }].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-4 rounded-lg shadow-sm"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-[#e6f6f0] p-3 rounded-full">
                    <s.icon className="w-6 h-6 text-[#0f6b53]" />
                  </div>
                  <p className="text-sm font-medium text-gray-800">
                    {s.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

</section>


      {/* FEATURED PRODUCTS - CENTERED CARDS SWIPER */}
     

            <section className="py-20 bg-gray-50">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-green-900 tracking-wide">
              {t('Our Featured Products')}
            </h2>
            <p className="mt-3 text-gray-600 text-lg">
              {t('Curated high quality produce from trusted farmers.')}
            </p>
          </div>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView={1}
            spaceBetween={25}
            loop={true}
            centeredSlides={false}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation={true}
            breakpoints={{
              640: { slidesPerView: 1.2 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="max-w-6xl mx-auto px-6"
          >
            {[
              { name: "Brinjal", img: img, desc: "High quality local brinjal available." },
              { name: "Potato", img: img2, desc: "Fresh and organic potatoes every day." },
              { name: "Pumpkin", img: img3, desc: "Premium grade pumpkins from local farms." },
              { name: "Cabbage", img: img4, desc: "Chemical-free fresh green cabbage." },
            ].map((p, i) => (
              <SwiperSlide key={i} className="flex justify-center">
                
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all
                            p-6 w-[320px] sm:w-[360px] md:w-[380px]
                            border border-gray-100"
                >
                  <div className="overflow-hidden rounded-xl">
                    <img
                      src={p.img}
                      alt={p.name}
                      className="w-full h-44 object-cover rounded-xl hover:scale-110 duration-500"
                    />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-800 mt-4">
                    {p.name}
                  </h3>

                  <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                    {p.desc}
                  </p>
                </motion.div>

              </SwiperSlide>
    ))}
  </Swiper>
</section>


   

      {/* TECHNOLOGY BANNER */}
      <section className="relative h-[300px] md:h-[360px]">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1600')" }} />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h3 className="text-2xl md:text-3xl font-bold">{t('Sustainable Farming Meets Technology: Building a Greener Future')}</h3>
            <p className="mt-3 text-white/90">{t('Innovative tools and insights to reduce waste and increase yields.')}</p>
            <div className="mt-4 flex gap-3">
              <button className="bg-custom-green px-5 py-2 rounded text-white">{t('learnMore')}</button>
              <button className="border border-white px-5 py-2 rounded text-white hover:bg-white hover:text-[#0f6b53]"><Link to="/contactus" className="hover:text-green-700">{t('Contact Us')}</Link></button>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS & STATS */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-custom-green">{t('The Benefits of Choosing Our Expertise')}</h3>
            <p className="text-gray-600 mt-4">{t('We combine local knowledge with technology to provide measurable improvements for farmers and buyers.')}</p>
            <button className="mt-6 bg-custom-green text-white px-6 py-2 rounded">{t('learnMore')}</button>
          </div>

          <div className="bg-custom-green text-white p-8 rounded-2xl">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-3 rounded-full">⭐</div>
                <div>
                  <p className="text-2xl font-bold">240+</p>
                  <p className="text-sm text-white/90">{t('Farmers')}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-3 rounded-full">👥</div>
                <div>
                  <p className="text-2xl font-bold">180+</p>
                  <p className="text-sm text-white/90">{t('Experts')}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-3 rounded-full">🌾</div>
                <div>
                  <p className="text-2xl font-bold">58+</p>
                  <p className="text-sm text-white/90">{t('Crops')}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-3 rounded-full">📦</div>
                <div>
                  <p className="text-2xl font-bold">1280+</p>
                  <p className="text-sm text-white/90">{t('Product Updates')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`bg-custom-green text-white py-12 ${isSinhala ? "font-sans " : "font-sans"}`}>
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-bold text-lg">{t('Smart Agriculture Market Management System')}</h4>
            <p className="text-white/90 mt-2 text-sm">{t('Empowering farmers with technology and reliable market insights.')}</p>
          </div>

          <div>
            <h5 className="font-semibold mb-2">Pages</h5>
            <ul className="text-sm text-white/90 space-y-2">
              <li>Home</li>
              <li>Products</li>
              <li>About</li>
              <li>Blog</li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-2">About</h5>
            <ul className="text-sm text-white/90 space-y-2">
              <li>Contact</li>
              <li>Services</li>
              <li>Support</li>
              <li>Careers</li>
            </ul>
          </div>
        </div>
      </footer>

    </div>
  );
}
