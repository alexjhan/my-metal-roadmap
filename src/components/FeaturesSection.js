export default function FeaturesSection() {
  const features = [
    { icon: '🎯', title: 'Especialización Total', description: 'Contenido 100% enfocado en metalurgia' },
    { icon: '🧬', title: 'Estructura Neuronal', description: 'Conexiones claras entre conceptos' },
    { icon: '🔬', title: 'Laboratorios Virtuales', description: 'Simulaciones interactivas' },
    { icon: '📊', title: 'Proyectos Reales', description: 'Casos de estudio industriales' },
    { icon: '🌐', title: 'Comunidad', description: 'Conecta con otros ingenieros' },
    { icon: '🚀', title: 'Actualización Constante', description: 'Últimas tecnologías' },
  ];

  return (
    <section id="features" className="container mx-auto py-16 px-6">
      <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">¿Por qué MetalRoadmap?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-white border rounded-lg p-6 text-center hover:shadow-lg">
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-slate-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
