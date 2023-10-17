"use client";
import React, { useState, useRef } from "react";
import { ethers } from "ethers";
import {
  Progress,
  Icon,
  toast,
  Text,
  chakra,
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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Radio,
  RadioGroup,
  Stack,
  useToast,
} from "@chakra-ui/react";

import doctorsideabi from "../../utils/doctorsideabi.json";

export default function ProfileForm() {
  const [diabetes, setDiabetes] = useState(false);
  const [disablilities, setDisabilities] = useState(false);
  const [highbp, setHighbp] = useState(false);
  const inputRef = useRef(null);
  const toast = useToast();
  const [recordImage, setRecordImage] = useState();
  const [name, setName] = useState("");
  const [ipfsUrl, setIpfsUrl] = useState("");

  const changeHandler = () => {
    setRecordImage(inputRef.current?.files[0]);
  };

  const uploadReport = async () => {
    if (window.ethereum._state.accounts.length !== 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_DOCTORSIDE_ADDRESS,
        doctorsideabi,
        signer
      );

      const accounts = await provider.listAccounts();
      contract.uploadMedicalReprt(name, accounts[0], accounts[0], ipfsUrl);
    }
  };

  const handleSubmit = async () => {
    if (window.ethereum._state.accounts.length !== 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_DOCTORSIDE_ADDRESS,
        doctorsideabi,
        signer
      );

      const accounts = await provider.listAccounts();
      contract.userWalletAddresstoUserId(accounts[0]).then((id) => {
        let numid = id.toNumber();
        console.log(numid);

        contract.takeUserHistory(numid, disablilities, highbp, diabetes, 0);
      });
    }
  };

  const uploadIPFS = async () => {
    const form = new FormData();
    form.append("file", recordImage ? recordImage : "");

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

        if (recordImage) {
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
        <Heading w="100%" textAlign={"center"} fontWeight="normal">
          Update Medical History
        </Heading>
        <Flex>
          <FormControl mr="5%" mt="4%">
            <FormLabel htmlFor="diabetes" fontWeight={"normal"}>
              Are you diagnosed with diabetes ?
            </FormLabel>
            <RadioGroup defaultValue="1">
              <Stack spacing={5} direction="row">
                <Radio
                  colorScheme="red"
                  value="1"
                  onChange={() => setDiabetes(false)}
                >
                  No
                </Radio>
                <Radio
                  colorScheme="green"
                  value="2"
                  onChange={() => setDiabetes(true)}
                >
                  Yes
                </Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
        </Flex>
        <Flex>
          <FormControl mr="5%" mt="4%">
            <FormLabel htmlFor="disablilities" fontWeight={"normal"}>
              Do you have any disablilities ?
            </FormLabel>
            <RadioGroup defaultValue="1">
              <Stack spacing={5} direction="row">
                <Radio
                  colorScheme="red"
                  value="1"
                  onChange={() => setDisabilities(false)}
                >
                  No
                </Radio>
                <Radio
                  colorScheme="green"
                  value="2"
                  onChange={() => setDisabilities(true)}
                >
                  Yes
                </Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
        </Flex>
        <Flex>
          <FormControl mr="5%" mt="4%">
            <FormLabel htmlFor="bp" fontWeight={"normal"}>
              Are you diagnosed with high blood pressure ?
            </FormLabel>
            <RadioGroup defaultValue="1">
              <Stack spacing={5} direction="row">
                <Radio
                  colorScheme="red"
                  value="1"
                  onChange={() => setHighbp(false)}
                >
                  No
                </Radio>
                <Radio
                  colorScheme="green"
                  value="2"
                  onChange={() => setHighbp(true)}
                >
                  Yes
                </Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
        </Flex>
        <FormControl mt="2%">
          <FormLabel
            fontWeight={"normal"}
            color="gray.700"
            _dark={{
              color: "gray.50",
            }}
          >
            Previous Medical Record
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
              <Text>{recordImage?.name}</Text>
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
                  <span>{"Upload Previous Medical Record"}</span>
                  <VisuallyHidden>
                    <input
                      ref={inputRef}
                      onChange={changeHandler}
                      id="file-upload"
                      name="file-upload"
                      type="file"
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

          <FormControl mr="5%">
            <FormLabel htmlFor="first-name" fontWeight={"normal"}>
              Report Name
            </FormLabel>
            <Input
              id="first-name"
              placeholder="Full name"
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
          <Button mt="2%" onClick={uploadReport}>
            Upload Medical Report
          </Button>
        </FormControl>
        <Button onClick={handleSubmit} mt="2%">
          Submit
        </Button>
      </Box>
    </>
  );
}
