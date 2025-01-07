import { useRef, useState, useEffect } from "react";
import { Box, HStack } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react"; // Use only Editor from @monaco-editor/react
import LanguageSelector from "./LanguageSelector";
import Output from "./Output";
import * as monaco from 'monaco-editor'; // Import monaco for types and instance access

interface CodeEditorProps {
  id: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ id }) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null); // Use monaco.editor types
  const [value, setValue] = useState<string>(""); // Code content
  const [language, setLanguage] = useState<string>("javascript"); // Default language
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
  const baseurl = import.meta.env.VITE_BASE_URL;

  // Fetch the code file data when the component mounts
  useEffect(() => {
    const fetchCodeFile = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        const response = await fetch(`${baseurl}/api/codes/${id}`, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
             Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const data = await response.json(); // Parse the JSON data
        const { content, language } = data; // Destructure the response
        setValue(content); // Set the code content
        setLanguage(language); // Set the programming language
        setIsLoading(false); // Loading complete
      } catch (error) {
        console.error('Error fetching the code file:', error);
        setIsLoading(false); // Stop loading on error
      }
    };
  
    fetchCodeFile();
  }, [id]);

  // This function will store the editor instance and focus it
  const onMount = (editorInstance: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editorInstance;
    editorInstance.focus();
  };

  const onSelect = (selectedLanguage: string) => {
    setLanguage(selectedLanguage);
  };

  if (isLoading) {
    return <Box>Loading...</Box>; // Show a loading indicator while fetching data
  }

  return (
    <Box>
      <HStack spacing={4}>
        <Box w="50%">
          <LanguageSelector language={language} onSelect={onSelect} />
          <Editor
            options={{
              minimap: { enabled: false },
            }}
            height="75vh"
            theme="vs-dark"
            language={language}
            value={value} // Dynamic value from the backend
            onMount={onMount} // Correct signature
            onChange={(newValue) => setValue(newValue || "")}
          />
        </Box>
        <Output editorRef={editorRef} language={language} id={id} />
      </HStack>
    </Box>
  );
};

export default CodeEditor;
