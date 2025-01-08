import { useRef, useState, useEffect } from "react";
import { Box, HStack, Spinner } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import Output from "./Output";
import * as monaco from "monaco-editor";

type SupportedLanguage = "javascript" | "typescript" | "python" | "java";

interface CodeEditorProps {
  id: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ id }) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [value, setValue] = useState<string>("");
  const [language, setLanguage] = useState<SupportedLanguage>("javascript");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const baseurl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchCodeFile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${baseurl}/api/codes/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        const { content, language } = data;

        if (
          ["javascript", "typescript", "python", "java"].includes(language)
        ) {
          setLanguage(language as SupportedLanguage);
        }

        setValue(content || "");
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching the code file:", error);
        setIsLoading(false);
      }
    };

    fetchCodeFile();
  }, [id, baseurl]);

  const onMount = (editorInstance: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editorInstance;
    editorInstance.focus();
  };

  const onSelect = (selectedLanguage: string) => {
    if (["javascript", "typescript", "python", "java"].includes(selectedLanguage)) {
      setLanguage(selectedLanguage as SupportedLanguage);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" />
      </div>
    );
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
            value={value}
            onMount={onMount}
            onChange={(newValue) => setValue(newValue || "")}
          />
        </Box>
        <Output editorRef={editorRef} language={language} id={id} />
      </HStack>
    </Box>
  );
};

export default CodeEditor;
