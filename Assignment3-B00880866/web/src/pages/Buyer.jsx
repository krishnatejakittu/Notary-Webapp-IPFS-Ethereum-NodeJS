import {
  Button,
  Flex,
  Heading,
  Link,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import web3 from "../web3";
import Agreement from "../Agreement";

const Buyer = () => {
  const [file, setFile] = useState(null);
  const [buffer, setBuffer] = useState(null);
  const [agreement, setAgreement] = useState({
    hashCode: "",
    notary: "",
    seller: "",
    buyer: "",
    retriveSellerSign: "",
    retriveBuyerSign: "",
  });
  const [status, setStatus] = useState({
    isApprovedBySeller: "PENDING",
    isApprovedByBuyer: "PENDING",
    isCancelledBySeller: "PENDING",
    isCancelledByBuyer: "PENDING",
  });
  const [isLoading, setIsLoading] = useState(false);

  const ApproveAgreement = async () => {
    if (!file || file === null) {
      return;
    }
    const accounts = await web3.eth.getAccounts();
    setIsLoading(true);

    const h = web3.utils.soliditySha3(buffer);
    const signature = await web3.eth.sign(h, accounts[0]);
    console.log(signature);

    await Agreement.methods.approvedAgreement("BUYER", signature).send({
      from: accounts[0],
    });

    setIsLoading(false);
    agreementFetching();
  };

  const DeclineAgreement = async () => {
    const accounts = await web3.eth.getAccounts();
    setIsLoading(true);
    await Agreement.methods.rejectAgreement("BUYER").send({
      from: accounts[0],
    });
    setIsLoading(false);
    agreementFetching();
  };

  const agreementFetching = async () => {
    const retriveHashCode = await Agreement.methods
      .retriveIPFSHashCode()
      .call();
    const retriveNotaryAddress = await Agreement.methods.retriveNotary().call();
    const retriveBuyerAddress = await Agreement.methods.retriveBuyer().call();
    const retriveSellerAddress = await Agreement.methods.retriveSeller().call();
    const retriveStatus = await Agreement.methods.retriveStatus().call();
    const retriveSellerSign = await Agreement.methods
      .retriveSellerSign()
      .call();
    const retriveBuyerSign = await Agreement.methods.retriveBuyerSign().call();

    const retriveStatusArr = retriveStatus.split(";");

    setAgreement((old) => {
      return {
        ...old,
        hashCode:
          retriveHashCode ===
          "0x0000000000000000000000000000000000000000000000000000000000000000"
            ? ""
            : retriveHashCode,
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
        retriveSellerSign,
        retriveBuyerSign,
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

    if (retriveHashCode.trim().length) {
      const response = await fetch("https://ipfs.io/ipfs/" + retriveHashCode);
      const data = await response.blob();
      const file = new File([data], "test.pdf", { type: "application/pdf" });
      setFile(file);
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadend = () => {
        const buffer = Buffer(reader.result);
        setBuffer(buffer);
      };
    }
  };

  useEffect(() => {
    agreementFetching();
  }, []);

  return (
    <Flex w="100vw" h="100vh" justify="center" align="center" flexDir="column">
      <Heading>Buyer</Heading>
      <Flex w="50%" mt="10" justify="space-evenly" align="center">
        {agreement.hashCode ? (
          <Link href={`https://ipfs.io/ipfs/${agreement.hashCode}`}>
            View PDF on IPFS
          </Link>
        ) : (
          <span />
        )}
        <Button
          mx="3"
          px="10"
          colorScheme="blue"
          onClick={ApproveAgreement}
          isLoading={isLoading}
          isDisabled={isLoading || status.isApprovedByBuyer === "TRUE"}
        >
          Sign & Approve
        </Button>
        <Button
          mx="3"
          px="10"
          colorScheme="red"
          onClick={DeclineAgreement}
          isLoading={isLoading}
          isDisabled={isLoading || status.isCancelledByBuyer === "TRUE"}
        >
          Reject
        </Button>
      </Flex>
      <Flex flexDir="column">
        {agreement.notary && (
          <Text mt="5" fontSize="xl">
            The contract is initialized by{" "}
            <span style={{ color: "green" }}>{agreement.notary}</span>
          </Text>
        )}
        <List mt="3">
          <ListItem>Buyer Signature: {agreement.retriveBuyerSign}</ListItem>
          <ListItem>Buyer Approved Status: {status.isApprovedByBuyer}</ListItem>
          <ListItem>
            Buyer Cancelled Status: {status.isCancelledByBuyer}
          </ListItem>
          <ListItem mt="1">
            Seller Signature: {agreement.retriveSellerSign}
          </ListItem>
          <ListItem>
            Seller Approved Status: {status.isApprovedBySeller}
          </ListItem>
          <ListItem>
            Seller Cancelled Status: {status.isCancelledBySeller}
          </ListItem>
        </List>
      </Flex>
    </Flex>
  );
};

export default Buyer;
