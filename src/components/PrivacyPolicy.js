import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiMail, FiShield } from 'react-icons/fi';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <FiArrowLeft className="mr-2" />
            Volver al inicio
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Política de Privacidad</h1>
          <p className="text-gray-600">Última actualización: Enero 2025</p>
        </div>

        {/* Contenido */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8">
          <div className="prose prose-lg max-w-none">
            <h2>1. Información General</h2>
            <p>
              MetalRoadmap ("nosotros", "nuestro", "la aplicación") es una plataforma educativa especializada en ingeniería metalúrgica que permite a los usuarios crear y gestionar roadmaps de aprendizaje personalizados.
            </p>

            <h2>2. Información que Recolectamos</h2>
            
            <h3>2.1 Información de Registro</h3>
            <ul>
              <li><strong>Dirección de correo electrónico</strong>: Para crear y gestionar tu cuenta</li>
              <li><strong>Nombre</strong>: Opcional, obtenido desde LinkedIn o proporcionado por el usuario</li>
              <li><strong>Contraseña</strong>: Solo para registro con email (no almacenamos contraseñas en texto plano)</li>
            </ul>

            <h3>2.2 Información de LinkedIn (Opcional)</h3>
            <p>Si eliges iniciar sesión con LinkedIn, podemos recibir:</p>
            <ul>
              <li>Nombre y apellido</li>
              <li>Dirección de correo electrónico</li>
              <li>Foto de perfil (si está disponible)</li>
              <li>Información básica del perfil público</li>
            </ul>

            <h3>2.3 Contenido del Usuario</h3>
            <ul>
              <li><strong>Roadmaps creados</strong>: Títulos, descripciones, emojis</li>
              <li><strong>Conceptos y nodos</strong>: Información educativa que agregas</li>
              <li><strong>Recursos</strong>: Enlaces y referencias que compartes</li>
              <li><strong>Metadatos</strong>: Fechas de creación, modificaciones</li>
            </ul>

            <h2>3. Cómo Usamos tu Información</h2>
            
            <h3>3.1 Propósitos Principales</h3>
            <ul>
              <li><strong>Autenticación</strong>: Verificar tu identidad y mantener tu sesión</li>
              <li><strong>Funcionalidad</strong>: Permitirte crear, editar y gestionar roadmaps</li>
              <li><strong>Mejoras</strong>: Analizar el uso para mejorar la aplicación</li>
              <li><strong>Comunicación</strong>: Enviar notificaciones importantes sobre tu cuenta</li>
            </ul>

            <h3>3.2 Análisis y Mejoras</h3>
            <ul>
              <li>Uso de datos agregados para mejorar la experiencia del usuario</li>
              <li>No vendemos, alquilamos o compartimos datos personales con terceros</li>
            </ul>

            <h2>4. Almacenamiento y Seguridad</h2>
            
            <h3>4.1 Base de Datos</h3>
            <ul>
              <li>Utilizamos Supabase (PostgreSQL) para almacenar datos</li>
              <li>Todos los datos están protegidos con Row Level Security (RLS)</li>
              <li>Cada usuario solo puede acceder a sus propios datos</li>
            </ul>

            <h3>4.2 Seguridad</h3>
            <ul>
              <li>Conexiones encriptadas (HTTPS)</li>
              <li>Autenticación segura</li>
              <li>Contraseñas hasheadas (cuando aplica)</li>
              <li>Acceso restringido a datos personales</li>
            </ul>

            <h2>5. Compartir Información</h2>
            
            <h3>5.1 No Vendemos Datos</h3>
            <ul>
              <li>No vendemos, alquilamos o comercializamos tus datos personales</li>
              <li>No compartimos información con anunciantes</li>
            </ul>

            <h3>5.2 Proveedores de Servicios</h3>
            <p>Podemos compartir datos con:</p>
            <ul>
              <li><strong>Supabase</strong>: Para almacenamiento y autenticación</li>
              <li><strong>Vercel</strong>: Para hosting de la aplicación</li>
              <li><strong>LinkedIn</strong>: Solo si usas login con LinkedIn</li>
            </ul>

            <h2>6. Tus Derechos</h2>
            
            <h3>6.1 Acceso y Control</h3>
            <ul>
              <li><strong>Ver tus datos</strong>: Puedes ver toda la información que tenemos sobre ti</li>
              <li><strong>Editar</strong>: Puedes actualizar tu información de perfil</li>
              <li><strong>Eliminar</strong>: Puedes eliminar tu cuenta y todos tus datos</li>
              <li><strong>Exportar</strong>: Puedes solicitar una copia de tus datos</li>
            </ul>

            <h3>6.2 Eliminación de Datos</h3>
            <ul>
              <li>Al eliminar tu cuenta, todos tus roadmaps y datos se eliminan permanentemente</li>
              <li>Los datos eliminados no se pueden recuperar</li>
            </ul>

            <h2>7. Cookies y Tecnologías de Seguimiento</h2>
            
            <h3>7.1 Cookies Necesarias</h3>
            <ul>
              <li><strong>Sesión</strong>: Para mantener tu sesión activa</li>
              <li><strong>Preferencias</strong>: Para recordar tus configuraciones</li>
              <li><strong>Seguridad</strong>: Para proteger contra ataques</li>
            </ul>

            <h3>7.2 No Usamos</h3>
            <ul>
              <li>Cookies de publicidad</li>
              <li>Seguimiento de terceros</li>
              <li>Análisis invasivo</li>
            </ul>

            <h2>8. Menores de Edad</h2>
            <ul>
              <li>Nuestra aplicación no está dirigida a menores de 13 años</li>
              <li>No recolectamos intencionalmente información de menores de 13 años</li>
              <li>Si eres padre y crees que tu hijo nos ha proporcionado información, contáctanos</li>
            </ul>

            <h2>9. Cambios a esta Política</h2>
            <ul>
              <li>Notificaremos cambios importantes por email</li>
              <li>La fecha de "última actualización" se modificará</li>
              <li>El uso continuado significa aceptación de los cambios</li>
            </ul>

            <h2>10. Contacto</h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="flex items-center text-blue-800 mb-2">
                <FiMail className="mr-2" />
                Para preguntas sobre privacidad:
              </h3>
              <ul className="text-blue-700">
                <li><strong>Email</strong>: [tu-email@dominio.com]</li>
                <li><strong>Sitio web</strong>: [tu-sitio-web.com/privacy]</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="flex items-center text-green-800 mb-2">
                <FiShield className="mr-2" />
                Para solicitudes de datos:
              </h3>
              <ul className="text-green-700">
                <li><strong>Acceso a datos</strong>: Solicita una copia de tus datos</li>
                <li><strong>Eliminación</strong>: Solicita eliminar tu cuenta y datos</li>
                <li><strong>Corrección</strong>: Solicita corregir información incorrecta</li>
              </ul>
            </div>

            <h2>11. Jurisdicción</h2>
            <p>
              Esta política se rige por las leyes de [tu país/región] y cumple con:
            </p>
            <ul>
              <li>GDPR (Europa)</li>
              <li>CCPA (California)</li>
              <li>LGPD (Brasil)</li>
              <li>Otras regulaciones aplicables</li>
            </ul>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-8">
              <p className="text-yellow-800 text-sm">
                <strong>Nota</strong>: Esta política de privacidad es un template. Debes personalizarla con:
              </p>
              <ul className="text-yellow-700 text-sm mt-2">
                <li>Tu información de contacto real</li>
                <li>Tu jurisdicción legal</li>
                <li>Cualquier práctica específica de tu aplicación</li>
                <li>Revisión legal si es necesario para tu caso de uso</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 