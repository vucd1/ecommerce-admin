// To safely access the window object in Next.js on server side. (Window obj does not exist on server side.)

import { useState, useEffect } from "react";


export const useOrigin = () => {
    const [mounted, setMounted] = useState(false);
    // Return the window.location.origin if the window is available and exists.
    const origin = typeof window != "undefined" && window.location.origin ? window.location.origin : "";

    // Hydration error handling
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return "";
    }

    return origin;
}


// LOOK MORE INTO WHY THIS FILE IS NECESSARY! I DON'T COMPLETELY UNDERSTAND WHAT IS SERVER SIDE AND WHY
// EXACTLY WE NEED TO CREATE HOOKS TO CHECK FOR INFO ABOUT THE WINDOW...

// ====== CHATGPT - WHY IT'S NECESSARY ON THE SERVER ========
// Server-Side Rendering (SSR):

// In Next.js, components can be rendered both on the server and the client. However, the window object 
// is only available in the browser (client-side).
// Attempting to access the window object on the server side will result in a ReferenceError because 
// the server environment (Node.js) does not have a window object.

// Hydration Errors:

// When a React component is first rendered on the server, the HTML is sent to the client. 
// React then "hydrates" this HTML to make it interactive.
// If there's a mismatch between the server-rendered HTML and the client-rendered HTML (e.g., 
// due to accessing window on the server), it can lead to hydration errors.



// ====== WHY IS A HOOK NECESSARY? ========
// ReferenceError: Attempting to access window directly in code that runs on the server will result 
// in a ReferenceError because window is not defined in the Node.js environment.

// Hydration Errors: Even if you conditionally check for window outside of a hook, you can still face 
// issues with hydration. The HTML generated on the server might differ from the HTML 
// generated on the client if the window check is not properly handled during the initial render.
