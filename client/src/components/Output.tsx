import { useState, useEffect, MutableRefObject } from "react";
import {
  Box,
  Button,
  Text,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  IconButton,
} from "@chakra-ui/react";
import { executeCode } from "../api";
import { CloseIcon } from "@chakra-ui/icons";

// Define supported languages
type SupportedLanguage = "javascript" | "typescript" | "python" | "java" | "csharp" | "php";

// Define prop types for Output component
interface OutputProps {
  editorRef: MutableRefObject<{ getValue: () => string | undefined }> | null; // Editor reference with getValue method
  language: SupportedLanguage; // Programming language as SupportedLanguage
  id: string; // Code file ID
}

const Output: React.FC<OutputProps> = ({ editorRef, language, id }) => {
  const [output, setOutput] = useState<string[] | null>(null); // Code output
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state for saving code
  const [isLoading_run, setIsLoading_run] = useState<boolean>(false); // Loading state for running code
  const [isError, setIsError] = useState<boolean>(false); // Error state for code output
  const [emails, setEmails] = useState<string[]>([]); // List of emails with access
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Modal state for new email input
  const [newEmail, setNewEmail] = useState<string>(''); // New email input
  const [isRemoving, setIsRemoving] = useState<boolean>(false); // State to toggle email removal
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false); // State to control dropdown visibility
  const toast = useToast();
  const baseurl = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  // Fetch emails on component mount
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await fetch(`${baseurl}/api/codes/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
        });

        if (response.ok) {
          const data = await response.json();
          setEmails(data.Access || []); // Assuming 'Access' field in response contains emails
        } else {
          throw new Error('Failed to fetch emails');
        }
      } catch (error) {
        console.error('Error fetching emails:', error);
        toast({
          title: "Error",
          description: "Unable to fetch email list.",
          status: "error",
          duration: 6000,
        });
      }
    };

    fetchEmails();
  }, [baseurl, id, toast, token]); // Depend on `id` to fetch emails for the correct code

  const runCode = async () => {
    const sourceCode = editorRef.current?.getValue();
    if (!sourceCode) return;
    try {
      setIsLoading_run(true);
      const { run: result } = await executeCode(language, sourceCode);
      setOutput(result.output.split("\n"));
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      result.stderr ? setIsError(true) : setIsError(false);
    } catch (error) {
        if (error instanceof Error) {
          console.log(error);
          toast({
            title: "An error occurred.",
            description: error.message || "Unable to run code",
            status: "error",
            duration: 6000,
          });
        } else {
          console.log(error);
          toast({
            title: "An error occurred.",
            description:"Unable to run code",
            status: "error",
            duration: 6000,
          });
        }
    } finally {
      setIsLoading_run(false);
    }
  };

  const saveCode = async () => {
    const content = editorRef.current?.getValue();
    if (!content) return;

    try {
      setIsLoading(true);
      const response = await fetch(`${baseurl}/api/codes/save/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token in Authorization header
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Content saved successfully!",
          status: "success",
          duration: 6000,
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to save content.",
          status: "error",
          duration: 6000,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        status: "error",
        duration: 6000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async () => {
    if (newEmail) {
      try {
        const response = await fetch(`${baseurl}/api/codes/give/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
          body: JSON.stringify({ email: newEmail }),
        });

        if (response.ok) {
          setEmails([...emails, newEmail]);
          setNewEmail('');
          setIsModalOpen(false);
          toast({
            title: "Access Granted",
            description: `Access granted to ${newEmail}`,
            status: "success",
            duration: 6000,
          });
        } else {
          const errorData = await response.json();
          toast({
            title: "Error",
            description: errorData.message || "Failed to add email.",
            status: "error",
            duration: 6000,
          });
        }
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          status: "error",
          duration: 6000,
        });
      }
    }
  };

  const toggleRemoveMode = () => {
    setIsRemoving(prev => !prev);
  };

  const removeEmail = async (emailToRemove: string) => {
    try {
      const response = await fetch(`${baseurl}/api/codes/take/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token in Authorization header
        },
        body: JSON.stringify({ email: emailToRemove }),
      });

      if (response.ok) {
        setEmails(emails.filter(email => email !== emailToRemove));
        toast({
          title: "Access Revoked",
          description: `Access revoked for ${emailToRemove}`,
          status: "success",
          duration: 6000,
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to remove email.",
          status: "error",
          duration: 6000,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        status: "error",
        duration: 6000,
      });
    }
  };

  return (
    <Box w="50%">
      <Text mb={2} fontSize="lg">Output</Text>
      <Button
        variant="outline"
        colorScheme="green"
        mb={4}
        isLoading={isLoading_run}
        onClick={runCode}
      >
        Run Code
      </Button>
      <Button
        variant="outline"
        colorScheme="green"
        mb={4}
        ml={2}
        isLoading={isLoading}
        onClick={saveCode}
      >
        Save Code
      </Button>

      <Menu isOpen={isDropdownOpen} onClose={() => setIsDropdownOpen(false)}>
        <MenuButton 
          as={Button} 
          variant="outline"
          colorScheme="green"
          mb={4}
          ml={2}
          onClick={() => setIsDropdownOpen(prev => !prev)}
        >
          Give Access
        </MenuButton>
        <MenuList>
          {emails.map((email, index) => (
            <MenuItem key={index} display="flex" alignItems="center">
              {email}
              {isRemoving && (
                <IconButton
                  aria-label="Remove email"
                  icon={<CloseIcon />}
                  onClick={() => removeEmail(email)}
                  variant="outline"
                  colorScheme="red"
                  size="sm"
                  ml={2}
                />
              )}
            </MenuItem>
          ))}
          <MenuItem onClick={toggleRemoveMode}>
            {isRemoving ? "Done Removing" : "Remove Email"}
          </MenuItem>
          <MenuItem onClick={() => setIsModalOpen(true)}>Enter New Email</MenuItem>
        </MenuList>
      </Menu>

      <Box
        height="75vh"
        p={2}
        color={isError ? "red.400" : ""}
        border="1px solid"
        borderRadius={4}
        borderColor={isError ? "red.500" : "#333"}
      >
        {output
          ? output.map((line, i) => <Text key={i}>{line}</Text>)
          : 'Click "Run Code" to see the output here'}
      </Box>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Give Access</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel htmlFor="email">Enter Email to Give Access:</FormLabel>
              <Input
                id="email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter email"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleEmailSubmit}>
              Submit
            </Button>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Output;
