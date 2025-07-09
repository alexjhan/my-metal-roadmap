export default function HeroSection() {
  return (
    <section className="mt-20 py-16 bg-white text-center container mx-auto px-6 rounded-xl shadow">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-slate-800">
        MetalRoadmap
      </h1>
      <p className=" text-gray-600 text-lg md:text-xl  mb-6 max-w-2xl mx-auto">
        Rutas de aprendizaje especializadas en Ingeniería Metalúrgica y Ciencia de Materiales
      </p>
      <p className="text-sm text-slate-400 mb-10">
        Contenido curado por la comunidad, proyectos prácticos y simulaciones interactivas
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <div className="bg-white border rounded-lg p-6 shadow hover:shadow-lg">
          <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
          <div className="text-slate-600">Roadmaps Especializados</div>
        </div>
        <div className="bg-white border rounded-lg p-6 shadow hover:shadow-lg">
          <div className="text-3xl font-bold text-blue-600 mb-2">150+</div>
          <div className="text-slate-600">Proyectos Prácticos</div>
        </div>
        <div className="bg-white border rounded-lg p-6 shadow hover:shadow-lg">
          <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
          <div className="text-slate-600">Simulaciones</div>
        </div>
        <div className="bg-white border rounded-lg p-6 shadow hover:shadow-lg">
          <div className="text-3xl font-bold text-blue-600 mb-2">25</div>
          <div className="text-slate-600">Laboratorios Virtuales</div>
        </div>
      </div>
    </section>
  );
}
