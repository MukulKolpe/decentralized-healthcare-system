import {
  Heading,
  Avatar,
  Box,
  Center,
  Image,
  Flex,
  Text,
  Stack,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

import { ParticleProvider } from "@particle-network/provider";
import { useSigner } from "wagmi";
import { useToast } from "@chakra-ui/react";
import documentabi from "../../utils/doctorsideabi.json";

const CardComponent = ({ sysUser, signal }) => {
  const age = sysUser.userAge.toNumber();
  const role = sysUser.userRole.toNumber();
  const userId = sysUser.userId.toNumber();

  const [size, setSize] = useState("md");
  const [adharsize, setAdharSize] = useState("md");
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const handleSizeClick = (newSize) => {
    setSize(newSize);
    onEditOpen();
  };

  const handleSizeClick2 = (newSize) => {
    setSize(newSize);
    onDeleteOpen();
  };

  const toast = useToast();

  const approveUser = async () => {
    if (window.ethereum._state.accounts.length !== 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_DOCTORSIDE_ADDRESS,
        documentabi,
        signer
      );

      const tx = await contract.approveUser(userId);

      const data = { email: sysUser[5] };
      fetch("http://localhost:5000/doctor-approval", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error("Error:", error));

      await tx.wait();
      toast({
        title: "Registration approved! ",
        description: "Please refresh the page to see the results.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }
  };
  return (
    <div>
      <Center py={6}>
        <Box
          maxW={"325px"}
          w={"full"}
          bg={useColorModeValue("white", "gray.800")}
          boxShadow={"2xl"}
          rounded={"md"}
          overflow={"hidden"}
        >
          <Image
            h={"120px"}
            w={"full"}
            src={
              "https://images.unsplash.com/photo-1612865547334-09cb8cb455da?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
            }
            objectFit={"cover"}
          />
          <Flex justify={"center"} mt={-12}>
            <Avatar
              size={"xl"}
              src={sysUser[7]}
              alt={"Author"}
              css={{
                border: "2px solid white",
              }}
            />
          </Flex>

          <Box p={6}>
            <Stack spacing={0} align={"center"} mb={5}>
              <Heading fontSize={"2xl"} fontWeight={500} fontFamily={"body"}>
                {sysUser[1]}
              </Heading>
              {role == 1 && <Text color={"gray.500"}>Admin</Text>}
              {role == 2 && <Text color={"gray.500"}>Doctor</Text>}
              {role == 3 && <Text color={"gray.500"}>User</Text>}
              {role == 4 && <Text color={"gray.500"}>Others</Text>}
            </Stack>

            <Stack direction={"column"} justify={"left"}>
              <Stack spacing={0} align={"center"}>
                <Text fontWeight={600}>Email: {sysUser[5]}</Text>
              </Stack>

              <Stack spacing={0} align={"center"}>
                {role == 2 ? (
                  <Text fontWeight={600}>License No: {sysUser[3]}</Text>
                ) : null}
              </Stack>
              <Stack spacing={0} align={"center"}>
                <Text fontWeight={600}>Experience (in years): {age}</Text>
              </Stack>
            </Stack>

            <Button
              w={"full"}
              mt={8}
              bg={useColorModeValue("#151f21", "gray.900")}
              color={"white"}
              rounded={"md"}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              onClick={() => handleSizeClick("xl")}
            >
              View Degree
            </Button>
            <Button
              w={"full"}
              mt={8}
              bg={useColorModeValue("#151f21", "gray.900")}
              color={"white"}
              rounded={"md"}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              onClick={() => handleSizeClick2("xl")}
            >
              View Adhar
            </Button>
            {signal == 1 && (
              <Button
                w={"full"}
                mt={8}
                bg={useColorModeValue("#151f21", "gray.900")}
                color={"white"}
                rounded={"md"}
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "lg",
                }}
                onClick={approveUser}
              >
                Approve
              </Button>
            )}
            <Modal isOpen={isEditOpen} onClose={onEditClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Degree</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  {role == 2 ? (
                    <img src={sysUser[8]}></img>
                  ) : (
                    <Text>User and other 3rd parties do not need a degree</Text>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button onClick={onEditClose}>Close</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>AdharCard</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <img src={sysUser[2]}></img>
                </ModalBody>
                <ModalFooter>
                  <Button onClick={onDeleteClose}>Close</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Box>
        </Box>
      </Center>
    </div>
  );
};

export default CardComponent;
