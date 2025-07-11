export const nodes = [
  // Nodo central - Termodinámica (NIVEL 0)
  {
    id: 'termodinamica',
    type: 'custom',
    position: { x: 0, y: 0 },
    data: {
      label: 'Termodinámica',
      description: 'Ciencia que estudia las transformaciones de energía en sistemas físicos',
      link: '/termodinamica',
      icon: '🔥'
    }
  },
  
  // NIVEL 1 - Conceptos principales (círculo interno)
  {
    id: 'sistemas',
    type: 'custom',
    position: { x: -200, y: -150 },
    data: {
      label: 'Sistemas',
      description: 'Sistemas termodinámicos y sus propiedades fundamentales',
      link: '/sistemas',
      icon: '⚙️'
    }
  },
  {
    id: 'primera-ley',
    type: 'custom',
    position: { x: 200, y: -150 },
    data: {
      label: 'Primera Ley',
      description: 'Conservación de la energía en sistemas termodinámicos',
      link: '/primera-ley',
      icon: '⚡'
    }
  },
  {
    id: 'segunda-ley',
    type: 'custom',
    position: { x: 200, y: 150 },
    data: {
      label: 'Segunda Ley',
      description: 'Entropía y espontaneidad de los procesos',
      link: '/segunda-ley',
      icon: '🔄'
    }
  },
  {
    id: 'energia-gibbs',
    type: 'custom',
    position: { x: -200, y: 150 },
    data: {
      label: 'Energía de Gibbs',
      description: 'Criterio de espontaneidad para reacciones químicas',
      link: '/energia-gibbs',
      icon: '⚖️'
    }
  },
  {
    id: 'equilibrio',
    type: 'custom',
    position: { x: 0, y: -250 },
    data: {
      label: 'Equilibrio',
      description: 'Estados de equilibrio termodinámico',
      link: '/equilibrio',
      icon: '⚖️'
    }
  },
  
  // NIVEL 2 - Subconceptos (círculo externo)
  // Conectados a Sistemas
  {
    id: 'sistema-abierto',
    type: 'custom',
    position: { x: -350, y: -250 },
    data: {
      label: 'Sistema Abierto',
      description: 'Intercambia materia y energía con el entorno',
      link: '/sistema-abierto',
      icon: '🔄'
    }
  },
  {
    id: 'sistema-cerrado',
    type: 'custom',
    position: { x: -350, y: -50 },
    data: {
      label: 'Sistema Cerrado',
      description: 'Solo intercambia energía, no materia',
      link: '/sistema-cerrado',
      icon: '🔒'
    }
  },
  {
    id: 'sistema-aislado',
    type: 'custom',
    position: { x: -350, y: 150 },
    data: {
      label: 'Sistema Aislado',
      description: 'No intercambia ni materia ni energía',
      link: '/sistema-aislado',
      icon: '🛡️'
    }
  },
  
  // Conectados a Primera Ley
  {
    id: 'energia-interna',
    type: 'custom',
    position: { x: 350, y: -250 },
    data: {
      label: 'Energía Interna',
      description: 'Energía total del sistema termodinámico',
      link: '/energia-interna',
      icon: '🔋'
    }
  },
  {
    id: 'trabajo',
    type: 'custom',
    position: { x: 350, y: -50 },
    data: {
      label: 'Trabajo',
      description: 'Transferencia de energía por fuerzas mecánicas',
      link: '/trabajo',
      icon: '💪'
    }
  },
  {
    id: 'calor',
    type: 'custom',
    position: { x: 350, y: 150 },
    data: {
      label: 'Calor',
      description: 'Transferencia de energía por diferencia de temperatura',
      link: '/calor',
      icon: '🌡️'
    }
  },
  
  // Conectados a Segunda Ley
  {
    id: 'entropia',
    type: 'custom',
    position: { x: 350, y: 250 },
    data: {
      label: 'Entropía',
      description: 'Medida del desorden molecular del sistema',
      link: '/entropia',
      icon: '📈'
    }
  },
  {
    id: 'espontaneidad',
    type: 'custom',
    position: { x: 200, y: 300 },
    data: {
      label: 'Espontaneidad',
      description: 'Criterios para reacciones espontáneas',
      link: '/espontaneidad',
      icon: '🎯'
    }
  },
  
  // Conectados a Energía de Gibbs
  {
    id: 'delta-g',
    type: 'custom',
    position: { x: -350, y: 250 },
    data: {
      label: 'ΔG = ΔH - TΔS',
      description: 'Ecuación fundamental de la energía libre de Gibbs',
      link: '/delta-g',
      icon: '🧮'
    }
  },
  {
    id: 'aplicaciones-metalurgicas',
    type: 'custom',
    position: { x: -200, y: 300 },
    data: {
      label: 'Aplicaciones Metalúrgicas',
      description: 'Uso de termodinámica en procesos metalúrgicos',
      link: '/aplicaciones-metalurgicas',
      icon: '🏭'
    }
  },
  
  // Conectados a Equilibrio
  {
    id: 'equilibrio-quimico',
    type: 'custom',
    position: { x: -100, y: -400 },
    data: {
      label: 'Equilibrio Químico',
      description: 'Reacciones químicas en estado de equilibrio',
      link: '/equilibrio-quimico',
      icon: '🧪'
    }
  },
  {
    id: 'equilibrio-fase',
    type: 'custom',
    position: { x: 100, y: -400 },
    data: {
      label: 'Equilibrio de Fases',
      description: 'Coexistencia de diferentes fases en equilibrio',
      link: '/equilibrio-fase',
      icon: '❄️'
    }
  }
]; 