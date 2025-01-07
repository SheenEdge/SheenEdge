import axios from "axios";
import { LANGUAGE_VERSIONS } from "./constants";

// Define the supported languages as a union of string literals
type Language = keyof typeof LANGUAGE_VERSIONS; // 'javascript' | 'typescript' | 'python' | 'java' | 'csharp' | 'php'

// Define the expected shape of the response data
interface ExecuteCodeResponse {
  language: string;
  version: string;
  run: {
    stdout: string;
    stderr: string;
    output: string;
    code: number;
  };
}

export const executeCode = async (language: Language, sourceCode: string): Promise<ExecuteCodeResponse> => {
  try {
    // Make a POST request to the Piston API
    console.log(LANGUAGE_VERSIONS[language]);
    const response = await axios.post<ExecuteCodeResponse>("https://emkc.org/api/v2/piston/execute", {
      language: language,
      version: LANGUAGE_VERSIONS[language], // Pass the version from the LANGUAGE_VERSIONS object
      files: [
        {
          content: sourceCode, // Source code to be executed
        },
      ],
    });

    return response.data; // Return the response data
  } catch (error) {
    console.error("Error executing code:", error);
    throw new Error("Failed to execute code");
  }
};
