import {
  Button,
  Flex,
  Heading,
  Input,
  Link,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import web3 from "../web3";
import Agreement from "../Agreement";
import ipfs from "../ipfs";

const Notary = () => {
  const [file, setFile] = useState(null);
  const [buffer, setBuffer] = useState(null);
  const [hash, setHash] = useState("");
  const [agreement, setAgreement] = useState({
    hashCode: "",
    notary: "",
    seller: "",
    buyer: "",
  });
  const [status, setStatus] = useState({
    isApprovedBySeller: "PENDING",
    isApprovedByBuyer: "PENDING",
    isCancelledBySeller: "PENDING",
    isCancelledByBuyer: "PENDING",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateAgreement = async () => {
    if (!file || file === null || !buffer || buffer === null) {
      return;
    }
    setIsLoading(true);
    ipfs.files.add(buffer, async (error, result) => {
      if (error) {
        console.log(error);
        setIsLoading(false);
        return;
      }
      setHash(result[0].hash);
      const accounts = await web3.eth.getAccounts();
      setIsLoading(true);
      await Agreement.methods.createAgreement(result[0].hash).send({
        from: accounts[0],
      });
      setIsLoading(false);
      agreementFetching();
    });
  };

  const agreementFetching = async () => {
    const retriveIPFSHashCode = await Agreement.methods
      .retriveIPFSHashCode()
      .call();
    const retriveNotaryAddress = await Agreement.methods.retriveNotary().call();
    const retriveBuyerAddress = await Agreement.methods.retriveBuyer().call();
    const retriveSellerAddress = await Agreement.methods.retriveSeller().call();
    const retriveStatus = await Agreement.methods.retriveStatus().call();

    const retriveStatusArr = retriveStatus.split(";");

    setAgreement((old) => {
      return {
        ...old,
        hashCode:
          retriveIPFSHashCode ===
          "0x0000000000000000000000000000000000000000000000000000000000000000"
            ? ""
            : retriveIPFSHashCode,
        notary:
          retriveNotaryAddress === "0x0000000000000000000000000000000000000000"
            ? ""
            : retriveNotaryAddress,
        buyer:
          retriveBuyerAddress === "0x0000000000000000000000000000000000000000"
            ? ""
            : retriveBuyerAddress,
        seller:
          retriveSellerAddress === "0x0000000000000000000000000000000000000000"
            ? ""
            : retriveSellerAddress,
      };
    });

    setStatus(() => {
      return {
        isApprovedByBuyer: retriveStatusArr[0],
        isApprovedBySeller: retriveStatusArr[1],
        isCancelledByBuyer: retriveStatusArr[2],
        isCancelledBySeller: retriveStatusArr[3],
      };
    });
  };

  useEffect(() => {
    agreementFetching();
  }, []);

  return (
    <Flex w="100vw" h="100vh" justify="center" align="center" flexDir="column">
      <Heading>Notary</Heading>
      <Flex w="50%" mt="10" justify="space-evenly" align="center">
        <Input
          placeholder="Select File"
          accept="application/pdf"
          type="file"
          onChange={(e) => {
            e.preventDefault();
            const file = e.target.files[0];
            if (!file) {
              return;
            }
            setFile(file);
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onloadend = () => {
              const buffer = Buffer(reader.result);
              setBuffer(buffer);
            };
          }}
        />
        <Button
          mx="3"
          px="10"
          colorScheme="blue"
          onClick={handleCreateAgreement}
          isLoading={isLoading}
          isDisabled={isLoading || agreement.hashCode}
        >
          Create Agreement
        </Button>
      </Flex>
      <Flex flexDir="column">
        <Text mt="3">
          {agreement.hashCode.length
            ? "You have initalized this agreement"
            : "This Agreement is not initalized"}
        </Text>
        {agreement.notary && (
          <Text mt="5" fontSize="xl">
            The contract is initialized by{" "}
            <span style={{ color: "green" }}>{agreement.notary}</span>
          </Text>
        )}
        <List mt="3">
          <ListItem>Buyer Status: {status.isApprovedByBuyer}</ListItem>
          <ListItem>Seller Status: {status.isApprovedBySeller}</ListItem>
        </List>

        {hash ? (
          <Link href={`https://ipfs.io/ipfs/${hash}`}>View PDF on IPFS</Link>
        ) : (
          <span />
        )}
      </Flex>
    </Flex>
  );
};

export default Notary;
