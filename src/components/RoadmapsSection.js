export default function RoadmapsSection() {
  const roadmaps = [
    { id: 'fundamentals', icon: '🧪', title: 'Fundamentos', description: 'Bases sólidas en química y física', progress: 85 },
    { id: 'physical', icon: '🔬', title: 'Metalurgia Física', description: 'Microestructura y transformaciones', progress: 70 },
    { id: 'extractive', icon: '⛏️', title: 'Metalurgia Extractiva', description: 'Procesamiento de minerales', progress: 60 },
    { id: 'materials', icon: '🏗️', title: 'Ciencia de Materiales', description: 'Nanomateriales y compuestos', progress: 40 },
    { id: 'processing', icon: '🏭', title: 'Procesamiento Industrial', description: 'Fundición y laminación', progress: 55 },
    { id: 'computational', icon: '💻', title: 'Metalurgia Computacional', description: 'Simulación FEM y CFD', progress: 25 },
  ];

  return (
    <section id="roadmaps" className="container mx-auto py-16 px-6">
      <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Roadmaps de Aprendizaje</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {roadmaps.map(roadmap => (
          <div key={roadmap.id} className="bg-white border rounded-lg p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-2">{roadmap.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{roadmap.title}</h3>
            <p className="text-slate-600 mb-4">{roadmap.description}</p>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-2" style={{width: `${roadmap.progress}%`}}></div>
            </div>
            <div className="text-right text-sm text-slate-500 mt-1">{roadmap.progress}%</div>
          </div>
        ))}
      </div>
    </section>
  );
}
