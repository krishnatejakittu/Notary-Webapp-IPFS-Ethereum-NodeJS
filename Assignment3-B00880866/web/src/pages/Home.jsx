import { Button, Flex } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Flex w="100vw" h="100vh" justify="space-evenly" align="center">
      <Link to="/notary">
        <Button colorScheme="linkedin" w="150px">
          Notary
        </Button>
      </Link>
      <Link to="/seller">
        <Button colorScheme="linkedin" w="150px">
          Seller
        </Button>
      </Link>
      <Link to="/buyer">
        <Button colorScheme="linkedin" w="150px">
          Buyer
        </Button>
      </Link>
    </Flex>
  );
};

export default Home;
