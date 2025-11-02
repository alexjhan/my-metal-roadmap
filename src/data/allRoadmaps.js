import { nodes as termodinamicaNodes } from './nodes';
import { edges as termodinamicaEdges } from './edges';

// Crear nodos vacíos para cada roadmap (solo el nodo central)
const createEmptyNodes = (title, icon) => [
  {
    id: 'central',
    type: 'custom',
    position: { x: 0, y: 0 },
    data: {
      label: title,
      description: `Mapa mental de ${title}`,
      icon: icon,
      nodeType: 'title'
    }
  }
];

// Crear edges vacíos (sin conexiones)
const emptyEdges = [];

export const allRoadmapsData = {
  // CIENCIAS BÁSICAS
  matematicas: {
    title: "Matemáticas",
    description: "Fundamentos matemáticos necesarios para la ingeniería metalúrgica. Álgebra, cálculo, ecuaciones diferenciales.",
    icon: "📐",
    nodes: createEmptyNodes("Matemáticas", "📐"),
    edges: emptyEdges
  },
  fisica: {
    title: "Física",
    description: "Principios físicos fundamentales aplicados a procesos metalúrgicos. Mecánica, electromagnetismo, óptica.",
    icon: "⚛️",
    nodes: createEmptyNodes("Física", "⚛️"),
    edges: emptyEdges
  },
  quimica: {
    title: "Química",
    description: "Fundamentos químicos para entender reacciones y transformaciones en metalurgia.",
    icon: "🧪",
    nodes: createEmptyNodes("Química", "🧪"),
    edges: emptyEdges
  },
  cinetica: {
    title: "Cinética Química",
    description: "Velocidad de reacciones químicas y procesos de transformación en metalurgia.",
    icon: "⚡",
    nodes: createEmptyNodes("Cinética Química", "⚡"),
    edges: emptyEdges
  },
  cienciaMateriales: {
    title: "Ciencia de Materiales",
    description: "Estudio de la estructura, propiedades y comportamiento de los materiales.",
    icon: "🔬",
    nodes: createEmptyNodes("Ciencia de Materiales", "🔬"),
    edges: emptyEdges
  },
  estadistica: {
    title: "Estadística y Probabilidad",
    description: "Métodos estadísticos para análisis de datos y control de calidad en metalurgia.",
    icon: "📊",
    nodes: createEmptyNodes("Estadística y Probabilidad", "📊"),
    edges: emptyEdges
  },
  metodosNumericos: {
    title: "Métodos Numéricos",
    description: "Técnicas computacionales para resolver problemas complejos en metalurgia.",
    icon: "💻",
    nodes: createEmptyNodes("Métodos Numéricos", "💻"),
    edges: emptyEdges
  },
  termodinamica: {
    title: "Termodinámica",
    description: "Fundamentos de termodinámica aplicada a procesos metalúrgicos.",
    icon: "🔥",
    nodes: termodinamicaNodes,
    edges: termodinamicaEdges
  },
  mecanica: {
    title: "Mecánica",
    description: "Principios mecánicos aplicados a procesos de conformado y deformación.",
    icon: "⚙️",
    nodes: createEmptyNodes("Mecánica", "⚙️"),
    edges: emptyEdges
  },
  transferenciaCalor: {
    title: "Transferencia de Calor",
    description: "Mecanismos de transferencia de calor en procesos metalúrgicos.",
    icon: "🌡️",
    nodes: createEmptyNodes("Transferencia de Calor", "🌡️"),
    edges: emptyEdges
  },
  electromagnetismo: {
    title: "Electromagnetismo",
    description: "Principios electromagnéticos aplicados a procesos metalúrgicos.",
    icon: "⚡",
    nodes: createEmptyNodes("Electromagnetismo", "⚡"),
    edges: emptyEdges
  },
  fisicoquimica: {
    title: "Fisicoquímica",
    description: "Interfase entre física y química en procesos metalúrgicos.",
    icon: "🔬",
    nodes: createEmptyNodes("Fisicoquímica", "🔬"),
    edges: emptyEdges
  },
  electroquimica: {
    title: "Electroquímica",
    description: "Procesos electroquímicos en metalurgia y corrosión.",
    icon: "⚡",
    nodes: createEmptyNodes("Electroquímica", "⚡"),
    edges: emptyEdges
  },
  estructuraCristalina: {
    title: "Estructura Cristalina",
    description: "Organización atómica y estructura cristalina de materiales metálicos.",
    icon: "💎",
    nodes: createEmptyNodes("Estructura Cristalina", "💎"),
    edges: emptyEdges
  },
  diagramasFase: {
    title: "Diagramas de Fase",
    description: "Representación gráfica de fases en equilibrio en sistemas metálicos.",
    icon: "📈",
    nodes: createEmptyNodes("Diagramas de Fase", "📈"),
    edges: emptyEdges
  },
  difusion: {
    title: "Difusión",
    description: "Procesos de difusión atómica en materiales metálicos.",
    icon: "🔄",
    nodes: createEmptyNodes("Difusión", "🔄"),
    edges: emptyEdges
  },
  transformacionesFase: {
    title: "Transformaciones de Fase",
    description: "Cambios de fase y transformaciones microestructurales en metales.",
    icon: "🔄",
    nodes: createEmptyNodes("Transformaciones de Fase", "🔄"),
    edges: emptyEdges
  },
  propiedadesMecanicas: {
    title: "Propiedades Mecánicas",
    description: "Características mecánicas de materiales metálicos.",
    icon: "💪",
    nodes: createEmptyNodes("Propiedades Mecánicas", "💪"),
    edges: emptyEdges
  },

  // EXTRACTIVA
  mineralogiaMenas: {
    title: "Mineralogía de Menas",
    description: "Identificación y caracterización de minerales en menas metálicas.",
    icon: "⛏️",
    nodes: createEmptyNodes("Mineralogía de Menas", "⛏️"),
    edges: emptyEdges
  },
  preparacionMinerales: {
    title: "Preparación de Minerales",
    description: "Procesos de preparación y acondicionamiento de minerales.",
    icon: "🏔️",
    nodes: createEmptyNodes("Preparación de Minerales", "🏔️"),
    edges: emptyEdges
  },
  conminucion: {
    title: "Conminución",
    description: "Reducción de tamaño de partículas minerales.",
    icon: "🔨",
    nodes: createEmptyNodes("Conminución", "🔨"),
    edges: emptyEdges
  },
  concentracionFlotacion: {
    title: "Concentración por Flotación",
    description: "Separación de minerales por flotación espumosa.",
    icon: "🫧",
    nodes: createEmptyNodes("Concentración por Flotación", "🫧"),
    edges: emptyEdges
  },
  separacionMagnetica: {
    title: "Separación Magnética",
    description: "Concentración de minerales magnéticos.",
    icon: "🧲",
    nodes: createEmptyNodes("Separación Magnética", "🧲"),
    edges: emptyEdges
  },
  separacionGravimétrica: {
    title: "Separación Gravimétrica",
    description: "Concentración por diferencias de densidad.",
    icon: "⚖️",
    nodes: createEmptyNodes("Separación Gravimétrica", "⚖️"),
    edges: emptyEdges
  },
  pirometalurgia: {
    title: "Pirometalurgia",
    description: "Procesos metalúrgicos a altas temperaturas.",
    icon: "🔥",
    nodes: createEmptyNodes("Pirometalurgia", "🔥"),
    edges: emptyEdges
  },
  calcinacionTostacion: {
    title: "Calcinación y Tostación",
    description: "Procesos de calentamiento en presencia de aire.",
    icon: "🔥",
    nodes: createEmptyNodes("Calcinación y Tostación", "🔥"),
    edges: emptyEdges
  },
  fusionMatas: {
    title: "Fusión de Matas",
    description: "Procesos de fusión para separación de metales.",
    icon: "🔥",
    nodes: createEmptyNodes("Fusión de Matas", "🔥"),
    edges: emptyEdges
  },
  reduccionCarbotermica: {
    title: "Reducción Carbotérmica",
    description: "Reducción de óxidos metálicos con carbono.",
    icon: "⚡",
    nodes: createEmptyNodes("Reducción Carbotérmica", "⚡"),
    edges: emptyEdges
  },
  refinacionPirometalurgica: {
    title: "Refinación Pirometalúrgica",
    description: "Purificación de metales por procesos térmicos.",
    icon: "🔥",
    nodes: createEmptyNodes("Refinación Pirometalúrgica", "🔥"),
    edges: emptyEdges
  },
  disenoReactores: {
    title: "Diseño de Reactores",
    description: "Diseño y optimización de reactores metalúrgicos.",
    icon: "🏭",
    nodes: createEmptyNodes("Diseño de Reactores", "🏭"),
    edges: emptyEdges
  },
  hidrometalurgia: {
    title: "Hidrometalurgia",
    description: "Procesos metalúrgicos en medio acuoso.",
    icon: "💧",
    nodes: createEmptyNodes("Hidrometalurgia", "💧"),
    edges: emptyEdges
  },
  lixiviacion: {
    title: "Lixiviación",
    description: "Disolución selectiva de metales en soluciones acuosas.",
    icon: "💧",
    nodes: createEmptyNodes("Lixiviación", "💧"),
    edges: emptyEdges
  },
  separacionLiquidoSolido: {
    title: "Separación Líquido-Sólido",
    description: "Técnicas de separación de fases líquidas y sólidas.",
    icon: "🔍",
    nodes: createEmptyNodes("Separación Líquido-Sólido", "🔍"),
    edges: emptyEdges
  },
  purificacionSoluciones: {
    title: "Purificación de Soluciones",
    description: "Limpieza y purificación de soluciones metalúrgicas.",
    icon: "🧪",
    nodes: createEmptyNodes("Purificación de Soluciones", "🧪"),
    edges: emptyEdges
  },
  precipitacion: {
    title: "Precipitación",
    description: "Separación de metales por precipitación química.",
    icon: "🌊",
    nodes: createEmptyNodes("Precipitación", "🌊"),
    edges: emptyEdges
  },
  electrometalurgia: {
    title: "Electrometalurgia",
    description: "Procesos metalúrgicos que involucran electricidad.",
    icon: "⚡",
    nodes: createEmptyNodes("Electrometalurgia", "⚡"),
    edges: emptyEdges
  },
  electrodeposicion: {
    title: "Electrodeposición",
    description: "Deposición de metales por procesos electrolíticos.",
    icon: "⚡",
    nodes: createEmptyNodes("Electrodeposición", "⚡"),
    edges: emptyEdges
  },
  electrolisis: {
    title: "Electrólisis",
    description: "Descomposición de compuestos por corriente eléctrica.",
    icon: "⚡",
    nodes: createEmptyNodes("Electrólisis", "⚡"),
    edges: emptyEdges
  },
  corrosionElectroquimica: {
    title: "Corrosión Electroquímica",
    description: "Mecanismos de corrosión en medios electroquímicos.",
    icon: "🛡️",
    nodes: createEmptyNodes("Corrosión Electroquímica", "🛡️"),
    edges: emptyEdges
  },

  // TRANSFORMATIVA
  fundicion: {
    title: "Fundición",
    description: "Procesos de fundición y colada de metales.",
    icon: "🔥",
    nodes: createEmptyNodes("Fundición", "🔥"),
    edges: emptyEdges
  },
  disenoAleaciones: {
    title: "Diseño de Aleaciones",
    description: "Desarrollo y diseño de aleaciones metálicas.",
    icon: "🔧",
    nodes: createEmptyNodes("Diseño de Aleaciones", "🔧"),
    edges: emptyEdges
  },
  procesosFundicion: {
    title: "Procesos de Fundición",
    description: "Técnicas y procesos de fundición metalúrgica.",
    icon: "🔥",
    nodes: createEmptyNodes("Procesos de Fundición", "🔥"),
    edges: emptyEdges
  },
  defectosFundicion: {
    title: "Defectos de Fundición",
    description: "Identificación y control de defectos en piezas fundidas.",
    icon: "🔍",
    nodes: createEmptyNodes("Defectos de Fundición", "🔍"),
    edges: emptyEdges
  },
  tratamientosModificacion: {
    title: "Tratamientos de Modificación",
    description: "Modificación de microestructuras en metales fundidos.",
    icon: "🔧",
    nodes: createEmptyNodes("Tratamientos de Modificación", "🔧"),
    edges: emptyEdges
  },
  conformadoMecanico: {
    title: "Conformado Mecánico",
    description: "Procesos de deformación plástica de metales.",
    icon: "🔨",
    nodes: createEmptyNodes("Conformado Mecánico", "🔨"),
    edges: emptyEdges
  },
  laminacion: {
    title: "Laminación",
    description: "Proceso de conformado por laminación.",
    icon: "📏",
    nodes: createEmptyNodes("Laminación", "📏"),
    edges: emptyEdges
  },
  forja: {
    title: "Forja",
    description: "Conformado por deformación plástica a alta temperatura.",
    icon: "🔨",
    nodes: createEmptyNodes("Forja", "🔨"),
    edges: emptyEdges
  },
  extrusion: {
    title: "Extrusión",
    description: "Proceso de conformado por extrusión.",
    icon: "🔧",
    nodes: createEmptyNodes("Extrusión", "🔧"),
    edges: emptyEdges
  },
  trefilado: {
    title: "Trefilado",
    description: "Reducción de diámetro de alambres y barras.",
    icon: "🔧",
    nodes: createEmptyNodes("Trefilado", "🔧"),
    edges: emptyEdges
  },
  conformadoChapas: {
    title: "Conformado de Chapas",
    description: "Procesos de conformado de láminas metálicas.",
    icon: "📋",
    nodes: createEmptyNodes("Conformado de Chapas", "📋"),
    edges: emptyEdges
  },
  tratamientosTermicos: {
    title: "Tratamientos Térmicos",
    description: "Procesos de calentamiento y enfriamiento controlado.",
    icon: "🔥",
    nodes: createEmptyNodes("Tratamientos Térmicos", "🔥"),
    edges: emptyEdges
  },
  recocido: {
    title: "Recocido",
    description: "Tratamiento térmico de recocido para ablandamiento.",
    icon: "🔥",
    nodes: createEmptyNodes("Recocido", "🔥"),
    edges: emptyEdges
  },
  normalizado: {
    title: "Normalizado",
    description: "Tratamiento térmico de normalizado.",
    icon: "🔥",
    nodes: createEmptyNodes("Normalizado", "🔥"),
    edges: emptyEdges
  },
  temple: {
    title: "Temple",
    description: "Tratamiento térmico de temple para endurecimiento.",
    icon: "🔥",
    nodes: createEmptyNodes("Temple", "🔥"),
    edges: emptyEdges
  },
  revenido: {
    title: "Revenido",
    description: "Tratamiento térmico de revenido para ajuste de propiedades.",
    icon: "🔥",
    nodes: createEmptyNodes("Revenido", "🔥"),
    edges: emptyEdges
  },
  tratamientosTermoquimicos: {
    title: "Tratamientos Termoquímicos",
    description: "Procesos de difusión de elementos en superficie.",
    icon: "🔥",
    nodes: createEmptyNodes("Tratamientos Termoquímicos", "🔥"),
    edges: emptyEdges
  },
  soldaduraUnion: {
    title: "Soldadura y Unión",
    description: "Técnicas de unión de materiales metálicos.",
    icon: "🔗",
    nodes: createEmptyNodes("Soldadura y Unión", "🔗"),
    edges: emptyEdges
  },
  procesosSoldadura: {
    title: "Procesos de Soldadura",
    description: "Diferentes procesos y técnicas de soldadura.",
    icon: "🔗",
    nodes: createEmptyNodes("Procesos de Soldadura", "🔗"),
    edges: emptyEdges
  },
  metalurgiaSoldadura: {
    title: "Metalurgia de la Soldadura",
    description: "Cambios metalúrgicos durante procesos de soldadura.",
    icon: "🔗",
    nodes: createEmptyNodes("Metalurgia de la Soldadura", "🔗"),
    edges: emptyEdges
  },

  // HERRAMIENTAS EXTRACTIVAS
  matlab: {
    title: "MATLAB",
    description: "Software de computación numérica y análisis de datos para ingeniería metalúrgica.",
    icon: "💻",
    nodes: createEmptyNodes("MATLAB", "💻"),
    edges: emptyEdges
  },
  python: {
    title: "Python",
    description: "Lenguaje de programación para análisis de datos y modelado en metalurgia.",
    icon: "🐍",
    nodes: createEmptyNodes("Python", "🐍"),
    edges: emptyEdges
  },
  r: {
    title: "R",
    description: "Lenguaje de programación para análisis estadístico y visualización de datos.",
    icon: "📊",
    nodes: createEmptyNodes("R", "📊"),
    edges: emptyEdges
  },
  minitab: {
    title: "Minitab",
    description: "Software estadístico para control de calidad y diseño de experimentos.",
    icon: "📈",
    nodes: createEmptyNodes("Minitab", "📈"),
    edges: emptyEdges
  },
  jmp: {
    title: "JMP",
    description: "Software de análisis estadístico y visualización de datos.",
    icon: "📊",
    nodes: createEmptyNodes("JMP", "📊"),
    edges: emptyEdges
  },
  excelAvanzado: {
    title: "Excel Avanzado",
    description: "Herramientas avanzadas de Excel para análisis de datos metalúrgicos.",
    icon: "📊",
    nodes: createEmptyNodes("Excel Avanzado", "📊"),
    edges: emptyEdges
  },
  hscChemistry: {
    title: "HSC Chemistry",
    description: "Software para cálculos termodinámicos y equilibrios químicos.",
    icon: "🧪",
    nodes: createEmptyNodes("HSC Chemistry", "🧪"),
    edges: emptyEdges
  },
  metsim: {
    title: "METSIM",
    description: "Software de simulación de procesos metalúrgicos.",
    icon: "🏭",
    nodes: createEmptyNodes("METSIM", "🏭"),
    edges: emptyEdges
  },
  usimPac: {
    title: "USIM PAC",
    description: "Software de simulación y optimización de procesos metalúrgicos.",
    icon: "⚙️",
    nodes: createEmptyNodes("USIM PAC", "⚙️"),
    edges: emptyEdges
  },
  limn: {
    title: "LIMN",
    description: "Software de simulación de flujos de fluidos en procesos metalúrgicos.",
    icon: "🌊",
    nodes: createEmptyNodes("LIMN", "🌊"),
    edges: emptyEdges
  },
  whittle: {
    title: "Whittle",
    description: "Software de optimización de pit mining y planificación minera.",
    icon: "⛏️",
    nodes: createEmptyNodes("Whittle", "⛏️"),
    edges: emptyEdges
  },
  analisisMultivariante: {
    title: "Análisis Multivariante",
    description: "Técnicas estadísticas para análisis de múltiples variables en metalurgia.",
    icon: "📊",
    nodes: createEmptyNodes("Análisis Multivariante", "📊"),
    edges: emptyEdges
  },
  optimizacionLineal: {
    title: "Optimización Lineal",
    description: "Métodos de optimización lineal aplicados a procesos metalúrgicos.",
    icon: "📐",
    nodes: createEmptyNodes("Optimización Lineal", "📐"),
    edges: emptyEdges
  },
  redesNeuronales: {
    title: "Redes Neuronales",
    description: "Inteligencia artificial para modelado y predicción en metalurgia.",
    icon: "🧠",
    nodes: createEmptyNodes("Redes Neuronales", "🧠"),
    edges: emptyEdges
  },
  algoritmosGeneticos: {
    title: "Algoritmos Genéticos",
    description: "Algoritmos de optimización inspirados en evolución biológica.",
    icon: "🧬",
    nodes: createEmptyNodes("Algoritmos Genéticos", "🧬"),
    edges: emptyEdges
  },
  controlEstadistico: {
    title: "Control Estadístico",
    description: "Técnicas de control estadístico de procesos metalúrgicos.",
    icon: "📊",
    nodes: createEmptyNodes("Control Estadístico", "📊"),
    edges: emptyEdges
  },
  sistemasScada: {
    title: "Sistemas SCADA",
    description: "Sistemas de supervisión, control y adquisición de datos.",
    icon: "🖥️",
    nodes: createEmptyNodes("Sistemas SCADA", "🖥️"),
    edges: emptyEdges
  },
  dcs: {
    title: "DCS",
    description: "Sistemas de control distribuido para procesos industriales.",
    icon: "⚙️",
    nodes: createEmptyNodes("DCS", "⚙️"),
    edges: emptyEdges
  },
  sensores: {
    title: "Sensores",
    description: "Tecnologías de sensores para monitoreo de procesos metalúrgicos.",
    icon: "📡",
    nodes: createEmptyNodes("Sensores", "📡"),
    edges: emptyEdges
  },
  analizadoresLinea: {
    title: "Analizadores en Línea",
    description: "Equipos de análisis automático en procesos metalúrgicos.",
    icon: "🔬",
    nodes: createEmptyNodes("Analizadores en Línea", "🔬"),
    edges: emptyEdges
  },
  controladoresPid: {
    title: "Controladores PID",
    description: "Controladores proporcional-integral-derivativo para procesos metalúrgicos.",
    icon: "🎛️",
    nodes: createEmptyNodes("Controladores PID", "🎛️"),
    edges: emptyEdges
  },

  // HERRAMIENTAS TRANSFORMATIVAS
  autocad: {
    title: "AutoCAD",
    description: "Software de diseño asistido por computadora para ingeniería metalúrgica.",
    icon: "📐",
    nodes: createEmptyNodes("AutoCAD", "📐"),
    edges: emptyEdges
  },
  solidworks: {
    title: "SolidWorks",
    description: "Software de diseño 3D y modelado paramétrico.",
    icon: "🔧",
    nodes: createEmptyNodes("SolidWorks", "🔧"),
    edges: emptyEdges
  },
  catia: {
    title: "CATIA",
    description: "Software de diseño y fabricación asistida por computadora.",
    icon: "🏭",
    nodes: createEmptyNodes("CATIA", "🏭"),
    edges: emptyEdges
  },
  inventor: {
    title: "Inventor",
    description: "Software de diseño 3D y simulación de productos.",
    icon: "🔧",
    nodes: createEmptyNodes("Inventor", "🔧"),
    edges: emptyEdges
  },
  fusion360: {
    title: "Fusion 360",
    description: "Software de diseño 3D y fabricación en la nube.",
    icon: "☁️",
    nodes: createEmptyNodes("Fusion 360", "☁️"),
    edges: emptyEdges
  },
  ansys: {
    title: "ANSYS",
    description: "Software de análisis por elementos finitos para ingeniería.",
    icon: "⚡",
    nodes: createEmptyNodes("ANSYS", "⚡"),
    edges: emptyEdges
  },
  abaqus: {
    title: "ABAQUS",
    description: "Software de análisis por elementos finitos y simulación.",
    icon: "🔬",
    nodes: createEmptyNodes("ABAQUS", "🔬"),
    edges: emptyEdges
  },
  comsol: {
    title: "COMSOL",
    description: "Software de simulación multiphysics para ingeniería.",
    icon: "🌐",
    nodes: createEmptyNodes("COMSOL", "🌐"),
    edges: emptyEdges
  },
  lsDyna: {
    title: "LS-DYNA",
    description: "Software de análisis dinámico no lineal por elementos finitos.",
    icon: "💥",
    nodes: createEmptyNodes("LS-DYNA", "💥"),
    edges: emptyEdges
  },
  deform: {
    title: "DEFORM",
    description: "Software de simulación de conformado de metales.",
    icon: "🔨",
    nodes: createEmptyNodes("DEFORM", "🔨"),
    edges: emptyEdges
  },
  procast: {
    title: "ProCAST",
    description: "Software de simulación de procesos de fundición.",
    icon: "🔥",
    nodes: createEmptyNodes("ProCAST", "🔥"),
    edges: emptyEdges
  },
  magma: {
    title: "MAGMA",
    description: "Software de simulación de fundición y solidificación.",
    icon: "🔥",
    nodes: createEmptyNodes("MAGMA", "🔥"),
    edges: emptyEdges
  },
  flow3d: {
    title: "FLOW-3D",
    description: "Software de simulación de flujos de fluidos y metal fundido.",
    icon: "🌊",
    nodes: createEmptyNodes("FLOW-3D", "🌊"),
    edges: emptyEdges
  },
  anycasting: {
    title: "AnyCasting",
    description: "Software de simulación de procesos de fundición.",
    icon: "🔥",
    nodes: createEmptyNodes("AnyCasting", "🔥"),
    edges: emptyEdges
  },
  novaflow: {
    title: "NovaFlow",
    description: "Software de simulación de flujos en procesos metalúrgicos.",
    icon: "🌊",
    nodes: createEmptyNodes("NovaFlow", "🌊"),
    edges: emptyEdges
  },
  dictra: {
    title: "DICTRA",
    description: "Software de simulación de difusión en materiales.",
    icon: "🔄",
    nodes: createEmptyNodes("DICTRA", "🔄"),
    edges: emptyEdges
  },
  thermocalc: {
    title: "Thermo-Calc",
    description: "Software de cálculos termodinámicos y diagramas de fase.",
    icon: "📈",
    nodes: createEmptyNodes("Thermo-Calc", "📈"),
    edges: emptyEdges
  },
  jmatpro: {
    title: "JMatPro",
    description: "Software de cálculo de propiedades de materiales.",
    icon: "🔬",
    nodes: createEmptyNodes("JMatPro", "🔬"),
    edges: emptyEdges
  },
  mtdata: {
    title: "MTDATA",
    description: "Software de bases de datos termodinámicas.",
    icon: "📊",
    nodes: createEmptyNodes("MTDATA", "📊"),
    edges: emptyEdges
  },
  pandat: {
    title: "PANDAT",
    description: "Software de cálculo de diagramas de fase multicomponente.",
    icon: "📈",
    nodes: createEmptyNodes("PANDAT", "📈"),
    edges: emptyEdges
  },
  metalografiaDigital: {
    title: "Metalografía Digital",
    description: "Técnicas digitales de análisis microestructural de metales.",
    icon: "🔬",
    nodes: createEmptyNodes("Metalografía Digital", "🔬"),
    edges: emptyEdges
  },
  ensayosMecanicos: {
    title: "Ensayos Mecánicos",
    description: "Técnicas de caracterización mecánica de materiales metálicos.",
    icon: "💪",
    nodes: createEmptyNodes("Ensayos Mecánicos", "💪"),
    edges: emptyEdges
  },
  ensayosNoDestructivos: {
    title: "Ensayos No Destructivos",
    description: "Técnicas de inspección sin dañar el material.",
    icon: "🔍",
    nodes: createEmptyNodes("Ensayos No Destructivos", "🔍"),
    edges: emptyEdges
  },
  mes: {
    title: "MES",
    description: "Sistemas de ejecución de manufactura para control de producción.",
    icon: "🏭",
    nodes: createEmptyNodes("MES", "🏭"),
    edges: emptyEdges
  },
  erp: {
    title: "ERP",
    description: "Sistemas de planificación de recursos empresariales.",
    icon: "💼",
    nodes: createEmptyNodes("ERP", "💼"),
    edges: emptyEdges
  },
  leanManufacturing: {
    title: "Lean Manufacturing",
    description: "Metodologías de manufactura esbelta para optimización de procesos.",
    icon: "⚡",
    nodes: createEmptyNodes("Lean Manufacturing", "⚡"),
    edges: emptyEdges
  },
  sixSigma: {
    title: "Six Sigma",
    description: "Metodología de mejora de procesos y control de calidad.",
    icon: "📊",
    nodes: createEmptyNodes("Six Sigma", "📊"),
    edges: emptyEdges
  }
}; 

// Export adicional: versión ordenada alfabéticamente por `title` (no reemplaza la exportación original)
export const sortedAllRoadmapsData = Object.fromEntries(
  Object.entries(allRoadmapsData).sort(([, a], [, b]) =>
    a.title.localeCompare(b.title, 'es', { sensitivity: 'base' })
  )
);