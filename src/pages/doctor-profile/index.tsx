"use client";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ParticleProvider } from "@particle-network/provider";
import doctorsideabi from "../../utils/doctorsideabi.json";
import spinner from "@/components/Spinner/Spinner";
import {
  Box,
  VStack,
  Button,
  Flex,
  Divider,
  chakra,
  Grid,
  GridItem,
  Container,
  Center,
  Input,
  Text,
  ButtonGroup,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

interface DataProps {
  heading: string;
  text: string;
}

const Feature = ({ heading, text }: DataProps) => {
  return (
    <GridItem>
      <chakra.h3 fontSize="xl" fontWeight="600">
        {heading}
      </chakra.h3>
      <chakra.p>{text}</chakra.p>
    </GridItem>
  );
};

const index = () => {
  const [loading, setLoading] = useState(true);
  const [userWalletAddress, setUserWalletAddress] = useState("");
  const [doctorInfo, setDoctorInfo] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [access, setAccess] = useState(true);
  const [date, setDate] = useState("choosen date");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [signal, setSignal] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const [appSignal, setAppSignal] = useState(false);

  const loadDoctorinfo = async () => {
    if (window.ethereum._state.accounts.length !== 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        "0x81B812D3b365046eD4C6848894cEA7961da59De5",
        doctorsideabi,
        signer
      );
      const accounts = await provider.listAccounts();
      setUserWalletAddress(accounts[0]);
      const userId = await contract.userWalletAddresstoUserId(accounts[0]);
      const userInfo = await contract.userIdtoUser(userId);
      setDoctorInfo(userInfo);
      if (Number(userInfo.userRole) === 2) {
        setLoading(false);
        setAccess(true);
      } else {
        setLoading(false);
        setAccess(false);
      }
    } else {
      return <div>Wallet not connected</div>;
    }
  };

  const loadAppointmentData = async () => {
    if (window.ethereum._state.accounts.length !== 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        "0x81B812D3b365046eD4C6848894cEA7961da59De5",
        doctorsideabi,
        signer
      );
      const accounts = await provider.listAccounts();
      setUserWalletAddress(accounts[0]);
      const userId = await contract.userWalletAddresstoUserId(accounts[0]);
      const userInfo = await contract.userIdtoUser(userId);
      setDoctorInfo(userInfo);
      if (Number(userInfo.userRole) === 2) {
        setLoading(false);
        setAccess(true);
        const totAppointments = await contract.getMapping1length(userId);
        console.log("Total appointments are: " + totAppointments);
        let tempAppointmentId, tempAppointment, appPatId, appPat;
        for (let i = totAppointments - 1; i >= 0; i--) {
          tempAppointmentId = await contract.docIdtoAppointmentId(userId, i);
          tempAppointment = await contract.appointmentIdtoAppointment(
            tempAppointmentId
          );
          console.log(tempAppointment);
          appPatId = await contract.userWalletAddresstoUserId(
            tempAppointment.patientWalletAddress
          );
          appPat = await contract.userIdtoUser(appPatId);
          console.log(appPat);
          setAppointments((prevState) => [
            ...prevState,
            { appPayload: tempAppointment, patPayload: appPat },
          ]);
          setAppSignal(true);
        }
      } else {
        setLoading(false);
        setAccess(false);
      }
    } else {
      return <div>Wallet not connected</div>;
    }
  };

  const loadTimeSlots = async (givenDate) => {
    console.log(givenDate);
    if (window.ethereum._state.accounts.length !== 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        "0x81B812D3b365046eD4C6848894cEA7961da59De5",
        doctorsideabi,
        signer
      );
      const accounts = await provider.listAccounts();
      setUserWalletAddress(accounts[0]);
      const userId = await contract.userWalletAddresstoUserId(accounts[0]);
      const userInfo = await contract.userIdtoUser(userId);
      setDoctorInfo(userInfo);
      const totalSlots = await contract.getMapping3length(userId, givenDate);
      console.log(`Total slots on ${givenDate} are ${totalSlots}`);
      let tempTimeSlot;
      for (let i = 0; i < totalSlots; i++) {
        tempTimeSlot = await contract.doctorIdtoDatetoTimeSlot(
          userId,
          givenDate,
          i
        );
        console.log(tempTimeSlot);
        setTimeSlots((prevState) => [...prevState, tempTimeSlot]);
      }
      setSignal(true);
    }
  };

  const openTimeSlot = async () => {
    if (window.ethereum._state.accounts.length !== 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        "0x81B812D3b365046eD4C6848894cEA7961da59De5",
        doctorsideabi,
        signer
      );
      const accounts = await provider.listAccounts();
      setUserWalletAddress(accounts[0]);
      const tx = await contract.openTimeslots(date, startTime, endTime);
      toast({
        title: "Time Slot Opened",
        description: "Please wait for the transaction to be confirmed",
        status: "info",
        duration: 1000,
        isClosable: true,
        position: "top-right",
      });
      await tx.wait();
      router.refresh();
    }
  };

  const approveAppointment = async (givenAppId) => {
    if (window.ethereum._state.accounts.length !== 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        "0x81B812D3b365046eD4C6848894cEA7961da59De5",
        doctorsideabi,
        signer
      );
      const accounts = await provider.listAccounts();
      setUserWalletAddress(accounts[0]);
      const tx = await contract.approveAppointment(givenAppId);
      toast({
        title: "Appointment Approved",
        description:
          "A confirmation mail will be sent to the associated patient",
        status: "info",
        duration: 1000,
        isClosable: true,
        position: "top-right",
      });
      await tx.wait();
      router.refresh();
    }
  };

  useEffect(() => {
    loadDoctorinfo();
  }, []);

  if (loading) {
    return <div>loading...</div>;
  } else if (!access) {
    return (
      <div>
        User is not a verified doctor. Only verified doctors can access this
        page.
      </div>
    );
  }

  return (
    <div>
      <Box as={Container} maxW="7xl" mt={14} p={4}>
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(2, 1fr)",
          }}
          gap={4}
        >
          <GridItem colSpan={3}>
            <VStack alignItems="flex-start" spacing="20px">
              <chakra.h2 fontSize="3xl" fontWeight="700">
                Welcome, {doctorInfo.userName} to your personalised dashboard!
              </chakra.h2>
            </VStack>
          </GridItem>
        </Grid>
        <Divider mt={12} mb={12} />
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          }}
          gap={{ base: "8", sm: "12", md: "16" }}
        >
          <Feature heading={"Name"} text={doctorInfo.userName} />
          <Feature heading={"License No."} text={doctorInfo.userLicenseNo} />
          <Feature heading={"Age"} text={doctorInfo.userAge.toString()} />
          <Feature heading={"Email"} text={doctorInfo.userEmail} />
          <Feature heading={"Speciality"} text={doctorInfo.userSpeciality} />
          <Feature
            heading={"Wallet Address"}
            text={doctorInfo.userWalletAddress}
          />
        </Grid>
        <Divider mt={12} mb={12} />
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(2, 1fr)",
          }}
          gap={4}
        >
          <GridItem colSpan={3}>
            <VStack alignItems="flex-start" spacing="20px">
              <chakra.h2 fontSize="3xl" fontWeight="700">
                Open Timeslots
              </chakra.h2>
            </VStack>
          </GridItem>
        </Grid>
        <Divider mt={12} mb={12} />
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          }}
          gap={{ base: "8", sm: "12", md: "16" }}
        >
          <GridItem>
            <Text mb="8px">Choose appropriate Date: </Text>
            <Input
              placeholder="Select Date"
              size="md"
              type="date"
              variant={"filled"}
              onChange={(e) => {
                setDate(e.target.value);
                loadTimeSlots(e.target.value);
              }}
            />
          </GridItem>
          <GridItem>
            <Text mb="8px">Choose appropriate Time: </Text>
            <Input
              placeholder="Select Time"
              size="md"
              type="time"
              variant={"filled"}
              onChange={(e) => {
                setStartTime(e.target.value);
              }}
            />
          </GridItem>
          <GridItem>
            <Text mb="8px">Choose appropriate Time: </Text>
            <Input
              placeholder="Select Time"
              size="md"
              type="time"
              variant={"filled"}
              onChange={(e) => {
                setEndTime(e.target.value);
              }}
            />
          </GridItem>
        </Grid>
        <Grid
          mt={4}
          templateColumns={{
            base: "repeat(1, 1fr)",
            sm: "repeat(1, 1fr)",
            md: "repeat(1, 1fr)",
          }}
          gap={4}
        >
          <Button
            onClick={() => {
              openTimeSlot();
            }}
          >
            Open New Slot
          </Button>
        </Grid>
        <Divider mt={6} mb={6} />
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(2, 1fr)",
          }}
          gap={4}
        >
          <GridItem colSpan={3}>
            <VStack alignItems="flex-start" spacing="20px">
              <chakra.h4 fontSize="3xl" fontWeight="700">
                Open slots on {date} are :
              </chakra.h4>
            </VStack>
          </GridItem>
        </Grid>
        <Divider mt={6} mb={6} />
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(8, 1fr)",
          }}
          gap={{ base: "8", sm: "12", md: "16" }}
        >
          {timeSlots &&
            timeSlots.map((ts) => (
              <GridItem>
                {ts.isBooked ? (
                  <Button isDisabled colorScheme="teal" variant="solid">
                    {ts.startTime} - {ts.endTime}
                  </Button>
                ) : (
                  <Button colorScheme="teal" variant="solid">
                    {ts.startTime} - {ts.endTime}
                  </Button>
                )}
              </GridItem>
            ))}
        </Grid>
        <Divider mt={12} mb={12} />
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(2, 1fr)",
          }}
          gap={4}
        >
          <GridItem colSpan={3}>
            <VStack alignItems="flex-start" spacing="20px">
              <chakra.h4 fontSize="3xl" fontWeight="700">
                Appointments: -
              </chakra.h4>
            </VStack>
          </GridItem>
        </Grid>
        <Divider mt={12} mb={12} />
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            sm: "repeat(1, 1fr)",
            md: "repeat(1, 1fr)",
          }}
          gap={4}
        >
          <GridItem colSpan={3}>
            {appSignal ? (
              <TableContainer>
                <Table variant="simple">
                  <TableCaption>All Appointments</TableCaption>
                  <Thead>
                    <Tr>
                      <Th>App Id.</Th>
                      <Th>Patient Name</Th>
                      <Th>Patient Age</Th>
                      <Th>App date</Th>
                      <Th>App Time</Th>
                      <Th>App Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {appointments.map((appoint) => (
                      <Tr>
                        <Td isNumeric>{Number(appoint.appPayload.appId)}</Td>
                        <Td>{appoint.patPayload.userName}</Td>
                        <Td>{Number(appoint.patPayload.userAge)} years</Td>
                        <Td>{appoint.appPayload.appDate}</Td>
                        <Td>
                          {appoint.appPayload.startTime} -{" "}
                          {appoint.appPayload.endTime}
                        </Td>
                        {appoint.appPayload.isApproved ? (
                          <Td>Approved</Td>
                        ) : (
                          <Td>
                            <Button
                              onClick={() => {
                                approveAppointment(appoint.appPayload.appId);
                              }}
                            >
                              Approve
                            </Button>
                          </Td>
                        )}
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <Button
                onClick={() => {
                  loadAppointmentData();
                }}
              >
                Load Appointment Data
              </Button>
            )}
          </GridItem>
        </Grid>
      </Box>
    </div>
  );
};

export default index;
