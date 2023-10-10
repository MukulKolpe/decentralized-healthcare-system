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

export default function Profile() {
  const [prevRec, setPrevRec] = useState();
  const [idCheck, setIdcheck] = useState();
  const [history, setHistory] = useState([]);
  const [click, setClick] = useState(false);
  const [docs, setDocs] = useState([]);
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
  }, [userid]);

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
      {userid === 0 ? (
        <ProfileForm />
      ) : (
        <>
          {click ? null : (
            <Center mt="10%">
              <Button onClick={getAllDocs}> View All Reports </Button>
            </Center>
          )}
          {docs.map((item) => (
            <Card mr="7%" ml="7%" mt="3%">
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
