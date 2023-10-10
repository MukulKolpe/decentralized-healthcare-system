"use client";
import { useState, useRef } from "react";
import { ethers } from "ethers";
import { ParticleProvider } from "@particle-network/provider";
import doctorsideabi from "../../utils/doctorsideabi.json";
import {
  Progress,
  Text,
  Stack,
  chakra,
  Icon,
  VisuallyHidden,
  Box,
  ButtonGroup,
  Button,
  Heading,
  Flex,
  FormControl,
  GridItem,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  InputLeftAddon,
  InputGroup,
  Textarea,
  FormHelperText,
  InputRightElement,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";

import { useToast } from "@chakra-ui/react";

const UserRegistration = () => {
  const toast = useToast();

  const [name, setName] = useState("");
  const [age, setAge] = useState();
  const [email, setEmail] = useState("");
  const inputRef = useRef(null);
  const [aadharImage, setAadharImage] = useState();
  const [ipfsUrl, setIpfsUrl] = useState("");

  const handleSubmit = async () => {
    if (window.ethereum._state.accounts.length !== 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_DOCTORSIDE_ADDRESS,
        doctorsideabi,
        signer
      );

      const tx = await contract.createUser(
        name,
        ipfsUrl,
        "",
        age,
        email,
        "",
        "",
        "",
        3
      );

      toast({
        title: "Registration request sent",
        description: "Please wait for the transaction to be confirmed",
        status: "info",
        duration: 1000,
        isClosable: true,
        position: "top-right",
      });
    } else {
      const particleProvider = new ParticleProvider(particle.auth);
      const accounts = await particleProvider.request({
        method: "eth_accounts",
      });
      const ethersProvider = new ethers.providers.Web3Provider(
        particleProvider,
        "any"
      );
      const signer = ethersProvider.getSigner();

      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_DOCTORSIDE_ADDRESS,
        doctorsideabi,
        signer
      );

      const tx = await contract.createUser(
        name,
        ipfsUrl,
        "",
        age,
        email,
        "",
        "",
        "",
        3
      );

      toast({
        title: "Registration request sent",
        description: "Please wait for the transaction to be confirmed",
        status: "info",
        duration: 1000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const changeHandler = () => {
    setAadharImage(inputRef.current?.files[0]);
  };

  const uploadIPFS = async () => {
    const form = new FormData();
    form.append("file", aadharImage ? aadharImage : "");

    const options = {
      method: "POST",
      body: form,
      headers: {
        Authorization: process.env.NEXT_PUBLIC_NFTPort_API_KEY,
      },
    };

    await fetch("https://api.nftport.xyz/v0/files", options)
      .then((response) => response.json())
      .then((response) => {
        // console.log(response);
        // console.log(response.ipfs_url);
        setIpfsUrl(response.ipfs_url);

        if (aadharImage) {
          toast({
            title: "Aadhar Card Uploaded to the IPFS.",
            description: "Congratulations 🎉 ",
            status: "success",
            duration: 1000,
            isClosable: true,
            position: "top-right",
          });
        } else {
          toast({
            title: "Aadhar card not Uploaded to the IPFS.",
            description: "Please attach the degree certificate ",
            status: "error",
            duration: 1000,
            isClosable: true,
            position: "top-right",
          });
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        maxWidth={800}
        p={6}
        m="10px auto"
        as="form"
      >
        <Heading w="100%" textAlign={"center"} fontWeight="normal" mb="2%">
          User Registration
        </Heading>

        <FormControl mr="5%">
          <FormLabel htmlFor="first-name" fontWeight={"normal"}>
            Name
          </FormLabel>
          <Input
            id="first-name"
            placeholder="Full name"
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
        <FormControl mr="5%" mt="2%">
          <FormLabel htmlFor="age" fontWeight={"normal"}>
            Age
          </FormLabel>
          <NumberInput
            step={1}
            defaultValue={18}
            min={1}
            onChange={(value) => setAge(value)}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl mr="5%">
          <FormLabel htmlFor="first-name" fontWeight={"normal"}>
            Email
          </FormLabel>
          <Input
            id="first-name"
            placeholder="Full name"
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl mt="2%">
          <FormLabel
            fontWeight={"normal"}
            color="gray.700"
            _dark={{
              color: "gray.50",
            }}
          >
            Aadhar Card
          </FormLabel>

          <Flex
            mt={1}
            justify="center"
            px={6}
            pt={5}
            pb={6}
            borderWidth={2}
            _dark={{
              color: "gray.500",
            }}
            borderStyle="dashed"
            rounded="md"
          >
            <Stack spacing={1} textAlign="center">
              <Icon
                mx="auto"
                boxSize={12}
                color="gray.400"
                _dark={{
                  color: "gray.500",
                }}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Icon>
              <Text>{aadharImage?.name}</Text>
              <Flex
                fontSize="sm"
                color="gray.600"
                _dark={{
                  color: "gray.400",
                }}
                alignItems="baseline"
              >
                <chakra.label
                  htmlFor="file-upload"
                  cursor="pointer"
                  rounded="md"
                  fontSize="md"
                  color="brand.600"
                  _dark={{
                    color: "brand.200",
                  }}
                  pos="relative"
                  _hover={{
                    color: "brand.400",
                    _dark: {
                      color: "brand.300",
                    },
                  }}
                >
                  <span>{"Upload Aadhar Card"}</span>
                  <VisuallyHidden>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      ref={inputRef}
                      onChange={changeHandler}
                    />
                  </VisuallyHidden>
                </chakra.label>
                <Text pl={1}>or drag and drop</Text>
              </Flex>
              <Text
                fontSize="xs"
                color="gray.500"
                _dark={{
                  color: "gray.50",
                }}
              >
                PNG, JPG, GIF up to 10MB
              </Text>
            </Stack>
          </Flex>
          <Flex>
            <Button onClick={uploadIPFS} mt="2%">
              Upload to IPFS
            </Button>
          </Flex>
        </FormControl>
        <Button onClick={handleSubmit} mt="2%">
          Submit
        </Button>
      </Box>
    </>
  );
};

export default UserRegistration;
