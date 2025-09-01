import { sdk } from "./medusa"; // Import sdk from the new medusa.ts file

// The SDK is now configured and exported from src/lib/medusa.ts
// This file can remain for other configurations if needed, but the SDK definition is moved.

export { sdk }; // Re-export the sdk for other modules that import from here