import { useEffect } from 'react';

const useExternalScriptsForIndex = () => {
    useEffect(() => {
      const head = document.querySelector("head");
      console.log(head)
      if (!head) return; // Ensure head element exists
      
      // Array of script URLs
      const scriptUrls = [
        "/assets/js/global.js",
        "/assets/vendor/nice-select/js/jquery.nice-select.min.js",
        "/assets/vendor/bootstrap/js/bootstrap.bundle.min.js",
        // "/assets/vendor/owl-carousel/js/owl.carousel.min.js",
        // "/assets/js/plugins/owl-carousel-init.js",
        "/assets/vendor/scrollit/scrollIt.js",
        "https://code.jquery.com/jquery-3.3.1.js",
        "/assets/js/plugins/scrollit-init.js",
        // "/assets/vendor/apexchart/apexcharts.min.js",
        // "/assets/vendor/apexchart/apexchart-init.js",
        "/assets/vendor/perfect-scrollbar/perfect-scrollbar.min.js",
        "/assets/js/scripts.js",
      ];
  
      // Load each script
      scriptUrls.forEach(url => {
        const script = document.createElement("script");
        script.src = url;
        head.appendChild(script);
      });
  
      // Cleanup function
      return () => {
        scriptUrls.forEach(url => {
          const scriptElement = document.querySelector(`script[src="${url}"]`);
          if (scriptElement && scriptElement.parentNode) {
            scriptElement.parentNode.removeChild(scriptElement);
          }
        });
      };
    }, []);
  
    return null; // This hook doesn't render anything
  };
  
  export default useExternalScriptsForIndex;