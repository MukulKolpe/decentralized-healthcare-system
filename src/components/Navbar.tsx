import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Icon,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, AddIcon } from "@chakra-ui/icons";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import { Link } from "@chakra-ui/next-js";

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box bg={useColorModeValue("white", "gray.800")} px={10}>
        <Flex
          h={16}
          alignItems="center"
          justifyContent="space-between"
          mx="auto"
        >
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack
            spacing={8}
            alignItems={"center"}
            fontSize="26px"
            fontWeight="0"
            ml="2"
            color="brand.00"
          >
            <Link href="/">Medscape</Link>
          </HStack>
          <Flex alignItems={"center"}>
            <div style={{ display: "flex" }}>
              <HStack
                as={"nav"}
                spacing={4}
                display={{ base: "none", md: "flex" }}
                marginRight={4}
              >
                <Link href="/user-registration">
                  <Button w="full" variant="ghost">
                    User Registration
                  </Button>
                </Link>
              </HStack>
              <HStack
                as={"nav"}
                spacing={4}
                display={{ base: "none", md: "flex" }}
                marginRight={4}
              >
                <Link href="/doctor-registration">
                  <Button w="full" variant="ghost">
                    Doctor Registration
                  </Button>
                </Link>
              </HStack>
              <HStack
                as={"nav"}
                spacing={4}
                display={{ base: "none", md: "flex" }}
                marginRight={4}
              >
                <Link href="/book">
                  <Button w="full" variant="ghost">
                    Book Appointment
                  </Button>
                </Link>
              </HStack>
              <HStack
                as={"nav"}
                spacing={4}
                display={{ base: "none", md: "flex" }}
                marginRight={4}
              >
                <Link href="/admin">
                  <Button w="full" variant="ghost">
                    Admin
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button w="full" variant="ghost">
                    Profile
                  </Button>
                </Link>
              </HStack>
              <ConnectButton />
            </div>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              <Link href="/user-registration">
                <Button w="full" variant="ghost">
                  User Registration
                </Button>
              </Link>
            </Stack>
            <Stack as={"nav"} spacing={4}>
              <Link href="/doctor-registration">
                <Button w="full" variant="ghost">
                  Legal Professional Registration
                </Button>
              </Link>
            </Stack>
            <Stack as={"nav"} spacing={4}>
              <Link href="/admin">
                <Button w="full" variant="ghost">
                  Admin
                </Button>
              </Link>
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
