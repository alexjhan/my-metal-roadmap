import {
  IconTitle,
  IconTopic,
  IconSubtopic,
  IconParagraph,
  IconButton,
  IconTodo,
  IconHorizontalLine,
  IconVerticalLine
} from './icons';

// Componentes disponibles para el roadmap
export const availableComponents = [
  {
    id: 'title',
    name: 'Título',
    icon: IconTitle,
    description: 'Título principal del concepto',
    type: 'title',
    defaultData: {
      label: 'Nuevo Título',
      description: 'Descripción del título',
      icon: IconTitle,
      backgroundColor: '#3B82F6',
      fontSize: '24px',
      fontWeight: 'bold',
      nodeType: 'title'
    }
  },
  {
    id: 'topic',
    name: 'Tema',
    icon: IconTopic,
    description: 'Tema o concepto principal',
    type: 'topic',
    defaultData: {
      label: 'Nuevo Tema',
      description: 'Descripción del tema',
      icon: IconTopic,
      backgroundColor: '#fdff00',
      fontSize: '18px',
      fontWeight: 'semibold',
      nodeType: 'topic'
    }
  },
  {
    id: 'subtopic',
    name: 'Subtema',
    icon: IconSubtopic,
    description: 'Subtema o subconcepto',
    type: 'subtopic',
    defaultData: {
      label: 'Nuevo Subtema',
      description: 'Descripción del subtema',
      icon: IconSubtopic,
      backgroundColor: '#F59E0B',
      fontSize: '16px',
      fontWeight: 'normal',
      nodeType: 'subtopic'
    }
  },
  {
    id: 'paragraph',
    name: 'Párrafo',
    icon: IconParagraph,
    description: 'Texto descriptivo o explicativo',
    type: 'paragraph',
    defaultData: {
      label: 'Nuevo Párrafo',
      description: 'Contenido del párrafo',
      icon: IconParagraph,
      backgroundColor: '#8B5CF6',
      fontSize: '14px',
      fontWeight: 'normal',
      nodeType: 'paragraph'
    }
  },
  {
    id: 'button',
    name: 'Botón',
    icon: IconButton,
    description: 'Enlace o botón de acción',
    type: 'button',
    defaultData: {
      label: 'Nuevo Botón',
      description: 'Descripción del botón',
      icon: IconButton,
      backgroundColor: '#1e40af',
      fontSize: '14px',
      fontWeight: 'normal',
      nodeType: 'button',
      url: ''
    }
  },
  {
    id: 'todo',
    name: 'Tarea',
    icon: IconTodo,
    description: 'Tarea pendiente',
    type: 'todo',
    defaultData: {
      label: 'Nueva Tarea',
      description: 'Descripción de la tarea',
      icon: IconTodo,
      backgroundColor: '#ffffff',
      fontSize: '14px',
      fontWeight: 'normal',
      nodeType: 'todo',
      completed: false
    }
  },
  {
    id: 'horizontal-line',
    name: 'Línea Horizontal',
    icon: IconHorizontalLine,
    description: 'Separador horizontal',
    type: 'horizontal-line',
    defaultData: {
      label: '',
      description: 'Separador',
      icon: IconHorizontalLine,
      backgroundColor: '#6B7280',
      fontSize: '12px',
      fontWeight: 'normal',
      nodeType: 'horizontal-line'
    }
  },
  {
    id: 'vertical-line',
    name: 'Línea Vertical',
    icon: IconVerticalLine,
    description: 'Separador vertical',
    type: 'vertical-line',
    defaultData: {
      label: '',
      description: 'Separador',
      icon: IconVerticalLine,
      backgroundColor: '#6B7280',
      fontSize: '12px',
      fontWeight: 'normal',
      nodeType: 'vertical-line'
    }
  }
];

// Lista completa de roadmaps disponibles
export const allRoadmaps = [
  {
    id: 'termodinamica',
    title: 'Termodinámica Metalúrgica',
    description: 'Mapa mental interactivo de conceptos fundamentales de termodinámica aplicada a procesos metalúrgicos',
    icon: '🔥',
    path: '/termodinamica',
    isCurrent: true,
    category: 'ciencias-basicas',
    difficulty: 'intermedio',
    estimatedTime: '40-60 horas',
    prerequisites: ['matematicas', 'fisica'],
    tags: ['termodinámica', 'energía', 'procesos', 'fundamentos'],
    lastUpdated: '2024-01-15',
    version: '1.2.0',
    author: 'Equipo MetalRoadmap',
    isPublic: true,
    totalNodes: 25,
    totalConnections: 18
  },
  {
    id: 'quimica',
    title: 'Química Metalúrgica',
    description: 'Procesos químicos en metalurgia y reacciones fundamentales',
    icon: '⚗️',
    path: '/quimica',
    isCurrent: false,
    category: 'ciencias-basicas',
    difficulty: 'intermedio',
    estimatedTime: '30-50 horas',
    prerequisites: ['quimica'],
    tags: ['química', 'reacciones', 'procesos', 'fundamentos'],
    lastUpdated: '2024-01-10',
    version: '1.0.0',
    author: 'Equipo MetalRoadmap',
    isPublic: true,
    totalNodes: 20,
    totalConnections: 15
  },
  {
    id: 'analisis',
    title: 'Análisis de Materiales',
    description: 'Técnicas de caracterización y análisis de materiales',
    icon: '🔬',
    path: '/analisis',
    isCurrent: false,
    category: 'tecnicas-analiticas',
    difficulty: 'avanzado',
    estimatedTime: '50-70 horas',
    prerequisites: ['cienciaMateriales', 'fisica'],
    tags: ['análisis', 'caracterización', 'técnicas', 'laboratorio'],
    lastUpdated: '2024-01-12',
    version: '1.1.0',
    author: 'Equipo MetalRoadmap',
    isPublic: true,
    totalNodes: 30,
    totalConnections: 22
  },
  {
    id: 'procesos',
    title: 'Procesos Industriales',
    description: 'Aplicaciones industriales y procesos de producción',
    icon: '🏭',
    path: '/procesos',
    isCurrent: false,
    category: 'procesos-industriales',
    difficulty: 'avanzado',
    estimatedTime: '60-80 horas',
    prerequisites: ['termodinamica', 'quimica'],
    tags: ['procesos', 'industria', 'producción', 'aplicaciones'],
    lastUpdated: '2024-01-08',
    version: '1.0.0',
    author: 'Equipo MetalRoadmap',
    isPublic: true,
    totalNodes: 35,
    totalConnections: 28
  },
  {
    id: 'fundicion',
    title: 'Fundición y Colada',
    description: 'Procesos de fundición y técnicas de colada',
    icon: '🌋',
    path: '/fundicion',
    isCurrent: false,
    category: 'procesos-industriales',
    difficulty: 'intermedio',
    estimatedTime: '40-60 horas',
    prerequisites: ['termodinamica', 'transferenciaCalor'],
    tags: ['fundición', 'colada', 'procesos', 'manufactura'],
    lastUpdated: '2024-01-05',
    version: '1.0.0',
    author: 'Equipo MetalRoadmap',
    isPublic: true,
    totalNodes: 28,
    totalConnections: 20
  },
  {
    id: 'tratamiento',
    title: 'Tratamiento Térmico',
    description: 'Técnicas de tratamiento térmico de materiales',
    icon: '⚡',
    path: '/tratamiento',
    isCurrent: false,
    category: 'procesos-industriales',
    difficulty: 'intermedio',
    estimatedTime: '35-55 horas',
    prerequisites: ['termodinamica', 'transformacionesFase'],
    tags: ['tratamiento', 'térmico', 'propiedades', 'materiales'],
    lastUpdated: '2024-01-03',
    version: '1.0.0',
    author: 'Equipo MetalRoadmap',
    isPublic: true,
    totalNodes: 22,
    totalConnections: 16
  },
  {
    id: 'corrosion',
    title: 'Corrosión y Protección',
    description: 'Mecanismos de corrosión y métodos de protección',
    icon: '🛡️',
    path: '/corrosion',
    isCurrent: false,
    category: 'ciencias-aplicadas',
    difficulty: 'intermedio',
    estimatedTime: '30-50 horas',
    prerequisites: ['electroquimica', 'quimica'],
    tags: ['corrosión', 'protección', 'durabilidad', 'materiales'],
    lastUpdated: '2024-01-01',
    version: '1.0.0',
    author: 'Equipo MetalRoadmap',
    isPublic: true,
    totalNodes: 25,
    totalConnections: 18
  },
  {
    id: 'metalurgia',
    title: 'Metalurgia Física',
    description: 'Propiedades físicas y mecánicas de los materiales',
    icon: '⚙️',
    path: '/metalurgia',
    isCurrent: false,
    category: 'ciencias-aplicadas',
    difficulty: 'avanzado',
    estimatedTime: '45-65 horas',
    prerequisites: ['propiedadesMecanicas', 'estructuraCristalina'],
    tags: ['metalurgia', 'física', 'propiedades', 'mecánicas'],
    lastUpdated: '2023-12-28',
    version: '1.0.0',
    author: 'Equipo MetalRoadmap',
    isPublic: true,
    totalNodes: 32,
    totalConnections: 24
  },
  {
    id: 'polimeros',
    title: 'Polímeros y Compuestos',
    description: 'Materiales poliméricos y compuestos avanzados',
    icon: '🧬',
    path: '/polimeros',
    isCurrent: false,
    category: 'materiales-avanzados',
    difficulty: 'avanzado',
    estimatedTime: '50-70 horas',
    prerequisites: ['cienciaMateriales', 'quimica'],
    tags: ['polímeros', 'compuestos', 'materiales', 'avanzados'],
    lastUpdated: '2023-12-25',
    version: '1.0.0',
    author: 'Equipo MetalRoadmap',
    isPublic: true,
    totalNodes: 30,
    totalConnections: 22
  },
  {
    id: 'ceramicos',
    title: 'Materiales Cerámicos',
    description: 'Cerámicas y materiales inorgánicos',
    icon: '🏺',
    path: '/ceramicos',
    isCurrent: false,
    category: 'materiales-avanzados',
    difficulty: 'intermedio',
    estimatedTime: '35-55 horas',
    prerequisites: ['cienciaMateriales'],
    tags: ['cerámicos', 'materiales', 'inorgánicos', 'propiedades'],
    lastUpdated: '2023-12-20',
    version: '1.0.0',
    author: 'Equipo MetalRoadmap',
    isPublic: true,
    totalNodes: 26,
    totalConnections: 19
  }
];

// Categorías de roadmaps
export const roadmapCategories = [
  {
    id: 'ciencias-basicas',
    name: 'Ciencias Básicas',
    description: 'Fundamentos científicos necesarios para la ingeniería metalúrgica',
    icon: '📚',
    color: '#3B82F6'
  },
  {
    id: 'tecnicas-analiticas',
    name: 'Técnicas Analíticas',
    description: 'Métodos y técnicas de análisis y caracterización de materiales',
    icon: '🔬',
    color: '#10B981'
  },
  {
    id: 'procesos-industriales',
    name: 'Procesos Industriales',
    description: 'Aplicaciones industriales y procesos de producción metalúrgica',
    icon: '🏭',
    color: '#F59E0B'
  },
  {
    id: 'ciencias-aplicadas',
    name: 'Ciencias Aplicadas',
    description: 'Aplicaciones prácticas de los principios científicos',
    icon: '⚙️',
    color: '#8B5CF6'
  },
  {
    id: 'materiales-avanzados',
    name: 'Materiales Avanzados',
    description: 'Materiales especializados y tecnologías emergentes',
    icon: '🚀',
    color: '#EF4444'
  }
];

// Niveles de dificultad
export const difficultyLevels = [
  { id: 'principiante', name: 'Principiante', color: '#10B981', description: 'Conceptos básicos y fundamentales' },
  { id: 'intermedio', name: 'Intermedio', color: '#F59E0B', description: 'Conceptos intermedios con aplicaciones' },
  { id: 'avanzado', name: 'Avanzado', color: '#EF4444', description: 'Conceptos avanzados y especializados' }
];

// Funciones de utilidad para gestión de roadmaps
export const roadmapUtils = {
  // Filtrar roadmaps por categoría
  filterByCategory: (roadmaps, category) => {
    return roadmaps.filter(roadmap => roadmap.category === category);
  },

  // Filtrar por nivel de dificultad
  filterByDifficulty: (roadmaps, difficulty) => {
    return roadmaps.filter(roadmap => roadmap.difficulty === difficulty);
  },

  // Buscar por tags
  searchByTags: (roadmaps, searchTerm) => {
    const term = searchTerm.toLowerCase();
    return roadmaps.filter(roadmap => 
      roadmap.tags.some(tag => tag.toLowerCase().includes(term)) ||
      roadmap.title.toLowerCase().includes(term) ||
      roadmap.description.toLowerCase().includes(term)
    );
  },

  // Obtener roadmaps por prerrequisitos
  getByPrerequisites: (roadmaps, completedRoadmaps) => {
    return roadmaps.filter(roadmap => 
      !roadmap.prerequisites || 
      roadmap.prerequisites.every(prereq => completedRoadmaps.includes(prereq))
    );
  },

  // Calcular progreso de un roadmap
  calculateProgress: (roadmap, completedNodes = []) => {
    if (!roadmap.totalNodes) return 0;
    return Math.round((completedNodes.length / roadmap.totalNodes) * 100);
  },

  // Obtener estadísticas de un roadmap
  getRoadmapStats: (roadmap) => {
    return {
      totalNodes: roadmap.totalNodes || 0,
      totalConnections: roadmap.totalConnections || 0,
      estimatedTime: roadmap.estimatedTime || 'N/A',
      difficulty: roadmap.difficulty || 'N/A',
      lastUpdated: roadmap.lastUpdated || 'N/A',
      version: roadmap.version || '1.0.0'
    };
  }
}; 