import { Box } from "@chakra-ui/react";
import CodeEditor from './components/CodeEditor';
import { useParams } from "react-router-dom"; // Correct router import

const Codo = () => {
  let { id } = useParams<{ id: string }>(); // Explicitly typing the param

  // If id is undefined, handle that case
  if (!id) {
    return <Box color="red.500">Invalid or missing ID</Box>;
  }

  return (
    <Box minH="100vh" bg="#0f0a19" color="gray.500" px={6} py={8}>
      <CodeEditor id={id} />
    </Box>
  );
};

export default Codo;
