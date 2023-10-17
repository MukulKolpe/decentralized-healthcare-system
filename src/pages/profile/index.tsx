"use client";
import React, { useEffect, useState } from "react";
import ProfileForm from "../../components/ProfileForm/ProfileForm";
import { ethers } from "ethers";
import { ParticleProvider } from "@particle-network/provider";
import doctorsideabi from "../../utils/doctorsideabi.json";
import {
  Card,
  CardHeader,
  Center,
  CardBody,
  CardFooter,
  Text,
  Box,
  StackDivider,
  Heading,
  Button,
  Flex,
  Link,
  ExternalLinkIcon,
  Stack,
} from "@chakra-ui/react";
import { WarningTwoIcon } from "@chakra-ui/icons";

export default function Profile() {
  const [prevRec, setPrevRec] = useState();
  const [idCheck, setIdcheck] = useState();
  const [history, setHistory] = useState([]);
  const [click, setClick] = useState(false);
  const [docs, setDocs] = useState([]);
  const [role, setRole] = useState(0);
  const [userid, setUserid] = useState();
  useEffect(() => {
    if (window.ethereum._state.accounts.length !== 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_DOCTORSIDE_ADDRESS,
        doctorsideabi,
        signer
      );
      const accounts = provider.listAccounts();
      accounts.then((account) => {
        const res = contract.userWalletAddresstoUserId(account[0]);

        let length;
        let userId;
        res.then((id) => {
          userId = id.toNumber();

          setUserid(userId);
          const role = contract.userIdtoUser(userId);
          role.then((res) => {
            let numRole = res.userRole.toNumber();
            setRole(numRole);
          });

          const history = contract.userIdtoPatientHistory(id.toNumber());

          let checkId;
          history.then((res) => {
            setHistory(res);
            checkId = res[0].toNumber();
            setIdcheck(checkId);
          });
        });
      });
    }
  }, []);

  const getAllDocs = () => {
    if (window.ethereum._state.accounts.length !== 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_DOCTORSIDE_ADDRESS,
        doctorsideabi,
        signer
      );
      const accounts = provider.listAccounts();
      const res = contract.userWalletAddresstoUserId(
        "0xa83A121E9957d69Fd24b133b280eBD4823380dBF"
      );

      const length = contract.getMapping4length(userid);
      length.then((res) => {
        console.log(res._hex);
        for (let i = 0; i < res.toNumber(); i++) {
          let docdata = contract.patientIdtoReport(userid, i);

          docdata.then((res) => {
            setDocs((prevState) => [...prevState, res]);
          });
        }
      });
      setClick(true);
    }
  };

  return (
    <div>
      {role !== 3 ? (
        <>
          <Box textAlign="center" py={10} px={6} mt={4}>
            <WarningTwoIcon boxSize={"50px"} color={"orange.300"} />
            <Heading as="h2" size="xl" mt={6} mb={2}>
              Only Registered user can see this page
            </Heading>
            <Text color={"gray.500"}>
              Please Login through registered user wallet address
            </Text>
          </Box>
        </>
      ) : (
        <>
          <ProfileForm />
          {click ? (
            <Center>
              <Heading mt="2%"> All Medical Documents </Heading>
            </Center>
          ) : (
            <Center>
              <Button my="3%" xl onClick={getAllDocs}>
                View All Reports{" "}
              </Button>
            </Center>
          )}

          {docs.map((item) => (
            <Card maxWidth={800} p={6} m="10px auto" mt="3%">
              <CardHeader>
                <Heading size="md"> {item[1]}</Heading>
              </CardHeader>
              <CardBody>
                <Text mt={2}>Prescribed by {item[3]}</Text>
              </CardBody>
              <CardFooter>
                <Stack align={"center"}>
                  <Button>
                    <Link href={item[4]} isExternal>
                      View Document
                    </Link>
                  </Button>
                </Stack>
              </CardFooter>
            </Card>
          ))}
        </>
      )}
    </div>
  );
}
