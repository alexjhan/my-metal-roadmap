import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-blue-900 py-6 pb-10 text-white sm:py-16 mt-12">
      <div className="container mx-auto px-4">
        <p className="mb-8 flex flex-col justify-center gap-0 font-medium text-blue-200 sm:mb-16 sm:flex-row sm:gap-4">
          <a className="border-b border-b-blue-700 px-2 py-1.5 transition-colors hover:text-white sm:border-b-0 sm:px-0 sm:py-0" href="/roadmaps">Roadmaps</a>
          <a className="border-b border-b-blue-700 px-2 py-1.5 transition-colors hover:text-white sm:border-b-0 sm:px-0 sm:py-0" href="/best-practices">Best Practices</a>
          <a className="border-b border-b-blue-700 px-2 py-1.5 transition-colors hover:text-white sm:border-b-0 sm:px-0 sm:py-0" href="/guides">Guides</a>
          <a className="border-b border-b-blue-700 px-2 py-1.5 transition-colors hover:text-white sm:border-b-0 sm:px-0 sm:py-0" href="/videos">Videos</a>
          <a className="border-b border-b-blue-700 px-2 py-1.5 transition-colors hover:text-white sm:border-b-0 sm:px-0 sm:py-0" href="/about">FAQs</a>
          <a className="px-2 py-1.5 transition-colors hover:text-white sm:border-b-0 sm:px-0 sm:py-0" href="https://youtube.com/theroadmap?sub_confirmation=1" target="_blank" rel="noopener noreferrer">YouTube</a>
        </p>
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:gap-2">
          <div className="max-w-[425px]">
            <p className="text-md flex items-center">
              <div className="inline-flex items-center text-lg font-medium text-white cursor-default">
                <img src="/assets/logo.png" alt="my-metal-roadmap" className="w-10 h-10 mr-2 filter brightness-0 invert" />
                <span className="ml-2">my-metal-roadmap</span>
              </div>
              <span className="mx-2 text-blue-300">by</span>
              <a className="font-regular rounded-md bg-blue-600 px-1.5 py-1 text-sm hover:bg-blue-700" href="https://www.linkedin.com/in/alex-j-geri-660918139" target="_blank" rel="noopener noreferrer">
                <span className="hidden sm:inline">Alex J. Geri</span>
                <span className="inline sm:hidden">Alex J. Geri</span>
              </a>
            </p>
            <p className="my-4 text-blue-200/60">
              Roadmaps educativos, mejores prácticas, recursos y comunidad para crecer en tu carrera.
            </p>
            <div className="text-sm text-blue-300">
              <p>
                © my-metal-roadmap
                <span className="mx-1.5">·</span>
                <a href="/terms" className="hover:text-white">Términos</a>
                <span className="mx-1.5">·</span>
                <a href="/privacy" className="hover:text-white">Privacidad</a>
                <span className="mx-1.5">·</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block h-5 w-5 fill-current">
                  <g clipPath="url(#clip0_2344_20)">
                    <path d="M0 0V24H24V0H0ZM8 19H5V8H8V19ZM6.5 6.732C5.534 6.732 4.75 5.942 4.75 4.968C4.75 3.994 5.534 3.204 6.5 3.204C7.466 3.204 8.25 3.994 8.25 4.968C8.25 5.942 7.467 6.732 6.5 6.732ZM20 19H17V13.396C17 10.028 13 10.283 13 13.396V19H10V8H13V9.765C14.397 7.179 20 6.988 20 12.241V19Z" fill="currentColor"></path>
                  </g>
                  <defs>
                    <clipPath id="clip0_2344_20">
                      <rect width="24" height="24" rx="2" fill="white"></rect>
                    </clipPath>
                  </defs>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="inline-block h-5 w-5 ml-2"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 3.993L9 16z"></path></svg>
                <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" id="Bluesky--Streamline-Simple-Icons" height="24" width="24" className="inline-block h-5 w-5 fill-current ml-2"><desc>Bluesky Streamline Icon: https://streamlinehq.com</desc><title>Bluesky</title><path d="M12 10.8c-1.087 -2.114 -4.046 -6.053 -6.798 -7.995C2.566 0.944 1.561 1.266 0.902 1.565 0.139 1.908 0 3.08 0 3.768c0 0.69 0.378 5.65 0.624 6.479 0.815 2.736 3.713 3.66 6.383 3.364 0.136 -0.02 0.275 -0.039 0.415 -0.056 -0.138 0.022 -0.276 0.04 -0.415 0.056 -3.912 0.58 -7.387 2.005 -2.83 7.078 5.013 5.19 6.87 -1.113 7.823 -4.308 0.953 3.195 2.05 9.271 7.733 4.308 4.267 -4.308 1.172 -6.498 -2.74 -7.078a8.741 8.741 0 0 1 -0.415 -0.056c0.14 0.017 0.279 0.036 0.415 0.056 2.67 0.297 5.568 -0.628 6.383 -3.364 0.246 -0.828 0.624 -5.79 0.624 -6.478 0 -0.69 -0.139 -1.861 -0.902 -2.206 -0.659 -0.298 -1.664 -0.62 -4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z" fill="currentColor" strokeWidth="1"></path></svg>

              </p>
            </div>
          </div>
          <div className="max-w-[340px] text-left lg:text-right">
            <p className="my-4 text-blue-200/60">
              El mejor recurso para roadmaps, recursos y comunidad educativa en metalurgia y ciencia.
            </p>
            <div className="text-sm text-blue-300">
              <p>
                <a href="/privacy" className="text-blue-300 hover:text-white">Política de Privacidad</a>
                <span className="mx-1.5">·</span>
                <a href="/terms" className="text-blue-300 hover:text-white">Términos</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
