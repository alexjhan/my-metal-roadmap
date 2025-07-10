export const edges = [
  // Conexiones desde el nodo principal
  {
    id: 'termodinamica-sistemas',
    source: 'termodinamica',
    target: 'sistemas',
    type: 'default',
    animated: true,
    style: { stroke: '#3B82F6', strokeWidth: 3 }
  },
  {
    id: 'termodinamica-primera-ley',
    source: 'termodinamica',
    target: 'primera-ley',
    type: 'default',
    animated: true,
    style: { stroke: '#3B82F6', strokeWidth: 3 }
  },
  {
    id: 'termodinamica-segunda-ley',
    source: 'termodinamica',
    target: 'segunda-ley',
    type: 'default',
    animated: true,
    style: { stroke: '#3B82F6', strokeWidth: 3 }
  },
  {
    id: 'termodinamica-energia-gibbs',
    source: 'termodinamica',
    target: 'energia-gibbs',
    type: 'default',
    animated: true,
    style: { stroke: '#3B82F6', strokeWidth: 3 }
  },
  {
    id: 'termodinamica-equilibrio',
    source: 'termodinamica',
    target: 'equilibrio',
    type: 'default',
    animated: true,
    style: { stroke: '#3B82F6', strokeWidth: 3 }
  },
  // Conexiones desde Sistemas
  {
    id: 'sistemas-sistema-abierto',
    source: 'sistemas',
    target: 'sistema-abierto',
    type: 'default',
    animated: true,
    style: { stroke: '#10B981', strokeWidth: 2 }
  },
  {
    id: 'sistemas-sistema-cerrado',
    source: 'sistemas',
    target: 'sistema-cerrado',
    type: 'default',
    animated: true,
    style: { stroke: '#10B981', strokeWidth: 2 }
  },
  {
    id: 'sistemas-sistema-aislado',
    source: 'sistemas',
    target: 'sistema-aislado',
    type: 'default',
    animated: true,
    style: { stroke: '#10B981', strokeWidth: 2 }
  },
  // Conexiones desde Primera Ley
  {
    id: 'primera-ley-energia-interna',
    source: 'primera-ley',
    target: 'energia-interna',
    type: 'default',
    animated: true,
    style: { stroke: '#F59E0B', strokeWidth: 2 }
  },
  {
    id: 'primera-ley-trabajo',
    source: 'primera-ley',
    target: 'trabajo',
    type: 'default',
    animated: true,
    style: { stroke: '#F59E0B', strokeWidth: 2 }
  },
  {
    id: 'primera-ley-calor',
    source: 'primera-ley',
    target: 'calor',
    type: 'default',
    animated: true,
    style: { stroke: '#F59E0B', strokeWidth: 2 }
  },
  // Conexiones desde Segunda Ley
  {
    id: 'segunda-ley-entropia',
    source: 'segunda-ley',
    target: 'entropia',
    type: 'default',
    animated: true,
    style: { stroke: '#EF4444', strokeWidth: 2 }
  },
  {
    id: 'segunda-ley-espontaneidad',
    source: 'segunda-ley',
    target: 'espontaneidad',
    type: 'default',
    animated: true,
    style: { stroke: '#EF4444', strokeWidth: 2 }
  },
  // Conexiones desde Energía de Gibbs
  {
    id: 'energia-gibbs-delta-g',
    source: 'energia-gibbs',
    target: 'delta-g',
    type: 'default',
    animated: true,
    style: { stroke: '#8B5CF6', strokeWidth: 2 }
  },
  {
    id: 'energia-gibbs-aplicaciones-metalurgicas',
    source: 'energia-gibbs',
    target: 'aplicaciones-metalurgicas',
    type: 'default',
    animated: true,
    style: { stroke: '#8B5CF6', strokeWidth: 2 }
  },
  // Conexiones desde Equilibrio
  {
    id: 'equilibrio-equilibrio-quimico',
    source: 'equilibrio',
    target: 'equilibrio-quimico',
    type: 'default',
    animated: true,
    style: { stroke: '#06B6D4', strokeWidth: 2 }
  },
  {
    id: 'equilibrio-equilibrio-fase',
    source: 'equilibrio',
    target: 'equilibrio-fase',
    type: 'default',
    animated: true,
    style: { stroke: '#06B6D4', strokeWidth: 2 }
  }
]; 