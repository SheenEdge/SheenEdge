import { useRef, useState, useEffect } from "react";
import { Box, HStack } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import Output from "./Output";
import axios from "axios"; // Assuming axios is used for API calls

const CodeEditor = ({ id }) => {
  const editorRef = useRef();
  const [value, setValue] = useState(""); // Code content
  const [language, setLanguage] = useState("javascript"); // Default language
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const baseurl = import.meta.env.VITE_BASE_URL;


  // Fetch the code file data when the component mounts
  useEffect(() => {
    const fetchCodeFile = async () => {
      try {
        const response = await fetch(`${baseurl}/api/codes/${id}`, {
          method: 'GET',
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
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
  

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    setValue(CODE_SNIPPETS[selectedLanguage]); // Optional: Load a snippet based on the selected language
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
            onMount={onMount}
            onChange={(newValue) => setValue(newValue)}
          />
        </Box>
        <Output editorRef={editorRef} language={language} id={id} />
      </HStack>
    </Box>
  );
};

export default CodeEditor;
