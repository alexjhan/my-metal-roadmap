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
    isCurrent: true
  },
  {
    id: 'quimica',
    title: 'Química Metalúrgica',
    description: 'Procesos químicos en metalurgia y reacciones fundamentales',
    icon: '⚗️',
    path: '/quimica',
    isCurrent: false
  },
  {
    id: 'analisis',
    title: 'Análisis de Materiales',
    description: 'Técnicas de caracterización y análisis de materiales',
    icon: '🔬',
    path: '/analisis',
    isCurrent: false
  },
  {
    id: 'procesos',
    title: 'Procesos Industriales',
    description: 'Aplicaciones industriales y procesos de producción',
    icon: '🏭',
    path: '/procesos',
    isCurrent: false
  },
  {
    id: 'fundicion',
    title: 'Fundición y Colada',
    description: 'Procesos de fundición y técnicas de colada',
    icon: '🌋',
    path: '/fundicion',
    isCurrent: false
  },
  {
    id: 'tratamiento',
    title: 'Tratamiento Térmico',
    description: 'Técnicas de tratamiento térmico de materiales',
    icon: '⚡',
    path: '/tratamiento',
    isCurrent: false
  },
  {
    id: 'corrosion',
    title: 'Corrosión y Protección',
    description: 'Mecanismos de corrosión y métodos de protección',
    icon: '🛡️',
    path: '/corrosion',
    isCurrent: false
  },
  {
    id: 'metalurgia',
    title: 'Metalurgia Física',
    description: 'Propiedades físicas y mecánicas de los materiales',
    icon: '⚙️',
    path: '/metalurgia',
    isCurrent: false
  },
  {
    id: 'polimeros',
    title: 'Polímeros y Compuestos',
    description: 'Materiales poliméricos y compuestos avanzados',
    icon: '🧬',
    path: '/polimeros',
    isCurrent: false
  },
  {
    id: 'ceramicos',
    title: 'Materiales Cerámicos',
    description: 'Cerámicas y materiales inorgánicos',
    icon: '🏺',
    path: '/ceramicos',
    isCurrent: false
  }
]; 