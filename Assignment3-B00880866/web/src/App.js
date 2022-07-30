import { ChakraProvider, theme } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Buyer from "./pages/Buyer";
import Home from "./pages/Home";
import Notary from "./pages/Notary";
import Seller from "./pages/Seller";

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notary" element={<Notary />} />
          <Route path="/seller" element={<Seller />} />
          <Route path="/buyer" element={<Buyer />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default App;
