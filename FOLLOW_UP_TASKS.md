# Follow-up Tasks - My Metal Roadmap

Este documento lista las tareas recomendadas para seguir mejorando el proyecto.

---

## 🎯 Tareas Prioritarias

### 1. ESLint + Prettier Configuration (ALTA PRIORIDAD)

**Descripción**: Agregar linting y formatting automático  
**Esfuerzo**: ~30 minutos  
**Impacto**: Alto (calidad de código, consistencia)

**Paso a Paso**:
```bash
# 1. Instalar dependencias
npm install --save-dev eslint prettier eslint-config-react-app eslint-plugin-react eslint-plugin-react-hooks

# 2. Crear .eslintrc.json
cat > .eslintrc.json << 'EOF'
{
  "extends": ["react-app", "react-app/jest"],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "warn",
    "react-hooks/rules-of-hooks": "error"
  }
}
EOF

# 3. Crear .prettierrc
cat > .prettierrc << 'EOF'
{
  "singleQuote": true,
  "trailingComma": "es5",
  "arrowParens": "always"
}
EOF

# 4. Actualizar package.json scripts
"lint": "eslint src/",
"lint:fix": "eslint src/ --fix",
"format": "prettier --write \"src/**/*.{js,jsx,css,md}\""
```

**Verificación**:
```bash
npm run lint      # Mostrar errores/warnings
npm run format    # Aplicar formato automático
```

---

### 2. Unit Tests Setup (ALTA PRIORIDAD)

**Descripción**: Agregar tests básicos para componentes críticos  
**Esfuerzo**: ~1 hora  
**Impacto**: Alto (confianza al refactorizar)

**Tests Sugeridos**:
- `src/App.test.js` - Renderiza sin crashes
- `src/components/Navbar.test.js` - Nav renderiza, contiene links
- `src/components/RoadmapGrid.test.js` - Grid renderiza con datos

**Archivo Ejemplo** (`src/App.test.js`):
```javascript
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders main navigation', () => {
    render(<App />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  test('renders footer', () => {
    render(<App />);
    expect(screen.getByText(/My Metal Roadmap/i)).toBeInTheDocument();
  });
});
```

**Ejecutar**:
```bash
npm test              # Ejecutar todos los tests
npm run test:watch   # Modo watch
```

---

### 3. GitHub Actions CI/CD (ALTA PRIORIDAD)

**Descripción**: Automatizar lint, test, build en cada push  
**Esfuerzo**: ~45 minutos  
**Impacto**: Alto (evita bugs, mantiene calidad)

**Archivo** (`.github/workflows/ci.yml`):
```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run lint
        run: npm run lint
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
```

**Resultado**: GitHub bloqueará PRs si lint/test/build fallan ✅

---

## 📦 Tareas Medianas

### 4. Limpiar `moveable-master/` Folder

**Descripción**: Remover o documentar la carpeta empaquetada  
**Esfuerzo**: ~15 minutos  
**Impacto**: Medio (repo 50MB+ más ligero)

**Opción A** (Recomendado):
```bash
# Eliminar carpeta
rm -rf src/moveable-master/

# Verificar que npm package 'moveable' sirve
npm ls moveable    # Debe estar en node_modules
```

**Opción B** (Si contiene customizaciones):
```bash
# Documentar en README.md por qué está incluida
# Considerar crear submodule o package separado
```

---

### 5. Agregar Documentation Extras

**Descripción**: Mejorar documentación con guías adicionales  
**Esfuerzo**: ~1 hora  
**Impacto**: Medio (facilita onboarding)

**Archivos a Crear**:

1. **DEVELOPMENT.md** - Workflow para contribuidores
   ```markdown
   # Development Guide
   
   ## Branch Strategy
   - main: production-ready
   - develop: development branch
   - feature/*: feature branches
   
   ## Commit Message Format
   - feat: new feature
   - fix: bug fix
   - docs: documentation
   - chore: no code changes
   
   ## PR Checklist
   - [ ] Tests added
   - [ ] Linting passes
   - [ ] Build succeeds
   ```

2. **ARCHITECTURE.md** - Diagrama de arquitectura, flujos de datos

3. **SUPABASE_SETUP.md** - Configuración de Supabase (tablas, auth, RLS)

---

### 6. TypeScript Migration (Opcional - BAJA PRIORIDAD)

**Descripción**: Migrar a TypeScript para type safety  
**Esfuerzo**: ~2-3 horas (paso a paso)  
**Impacto**: Alto pero opcional (mejor IDE support, menos bugs)

**Inicio Rápido**:
```bash
# Instalación
npm install --save-dev typescript @types/react @types/node

# Generar tsconfig.json
npx tsc --init

# Renombrar un archivo como test
mv src/App.js src/App.tsx
```

**Considerar**: Hacer esto en PR separado, no es urgente

---

## 🧪 Tareas de Testing Avanzado

### 7. E2E Tests con Cypress/Playwright

**Descripción**: Tests de integración end-to-end  
**Esfuerzo**: ~2 horas  
**Impacto**: Medio-Alto (evita regresiones UI)

**Ejemplo** (`cypress/e2e/roadmap.cy.js`):
```javascript
describe('Roadmap Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('displays roadmap grid', () => {
    cy.get('[data-testid="roadmap-grid"]').should('exist');
    cy.get('[data-testid="roadmap-card"]').should('have.length.greaterThan', 0);
  });

  it('navigates to roadmap on click', () => {
    cy.get('[data-testid="roadmap-card"]').first().click();
    cy.url().should('include', '/roadmap/');
  });
});
```

---

## 🚀 Tareas de Deployment

### 8. Setup Vercel Deployment

**Descripción**: Configurar auto-deployment en Vercel  
**Esfuerzo**: ~30 minutos  
**Impacto**: Alto (deployment automático)

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Deploy (primera vez)
vercel

# 3. Configurar env vars en Vercel dashboard
REACT_APP_SUPABASE_URL=...
REACT_APP_SUPABASE_ANON_KEY=...
```

**Resultado**: Cada push a main → deployment automático ✅

---

## 📊 Priorización Recomendada

| Tarea | Prioridad | Esfuerzo | Impacto | Cuándo |
|-------|-----------|----------|--------|--------|
| ESLint + Prettier | 🔴 ALTA | 30 min | Alto | Ahora |
| Unit Tests | 🔴 ALTA | 1h | Alto | Ahora |
| GitHub Actions CI | 🔴 ALTA | 45 min | Alto | Próxima semana |
| Limpiar moveable | 🟡 MEDIA | 15 min | Medio | Próxima semana |
| Docs extras | 🟡 MEDIA | 1h | Medio | Siguiente |
| E2E Tests | 🟡 MEDIA | 2h | Medio-Alto | Siguiente |
| TypeScript | 🟢 BAJA | 2-3h | Alto | Después |
| Vercel Deploy | 🟢 BAJA | 30 min | Alto | Después |

---

## ✅ Checklist para PR

Cuando implementes cada tarea, incluir:

```markdown
## Changes
- [x] ESLint + Prettier config added
- [x] Base unit tests created
- [x] CI workflow added

## Verification
- [x] `npm run lint` passes
- [x] `npm test` passes
- [x] `npm run build` succeeds
- [x] No console errors in dev

## Testing
- [ ] Manually tested on localhost
- [ ] No visual regressions
- [ ] All tests green

## Documentation
- [ ] README updated if needed
- [ ] Comments added for complex logic
- [ ] CHANGELOG updated
```

---

## 📞 FAQ

**Q: ¿Por dónde empezamos?**  
A: ESLint + Tests. Son "quick wins" que mejoran calidad inmediata.

**Q: ¿ESLint romperá el build?**  
A: No, si lo configuramos con `--warn`. Lint issues no paran el build, pero GitHub Actions sí.

**Q: ¿Necesitamos Playwright o Cypress?**  
A: Cypress es más fácil. Pero unit tests + CI/CD ya cubren 80% de necesidades.

**Q: ¿Cuándo hacemos TypeScript?**  
A: Después de que lint + tests estén setup. No es urgente pero suma a mantenibilidad.

---

**Siguiente**: Elige 1-2 tareas prioritarias de arriba y abre un PR 🚀
