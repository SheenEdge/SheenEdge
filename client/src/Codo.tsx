import { Box } from "@chakra-ui/react";
import CodeEditor from "./components/CodeEditor"
import { useParams } from "react-router";

const Codo = () => {
  let { id } = useParams();

  return (
    <Box minH="100vh" bg="#0f0a19" color="gray.500" px={6} py={8}>
    <CodeEditor id={id} />
    </Box>
  )
}

export default Codo;