// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract AgreementContract {
    struct Agreement_B00880866 {
        string ipfsHashCode;
        string buyerSig;
        string sellerSig;
        address notary;
        address seller;
        address buyer;
        string isApprovedBySeller;
        string isApprovedByBuyer;
        string isCancelledBySeller;
        string isCancelledByBuyer;
    }
    Agreement_B00880866 agreement_866;

    function createAgreement(string memory message) public {
        agreement_866 = Agreement_B00880866({
            ipfsHashCode: message,
            buyerSig: "",
            sellerSig: "",
            notary: msg.sender,
            seller: msg.sender,
            buyer: msg.sender,
            isApprovedBySeller: "PENDING",
            isApprovedByBuyer: "PENDING",
            isCancelledBySeller: "PENDING",
            isCancelledByBuyer: "PENDING"
        });
    }

    function retriveIPFSHashCode() public view returns (string memory) {
        return agreement_866.ipfsHashCode;
    }

    function retriveNotary() public view returns (address) {
        return agreement_866.notary;
    }

    function retriveSeller() public view returns (address) {
        return agreement_866.seller;
    }

    function retriveBuyer() public view returns (address) {
        return agreement_866.buyer;
    }

    function retriveBuyerSign() public view returns (string memory) {
        return agreement_866.buyerSig;
    }

    function retriveSellerSign() public view returns (string memory) {
        return agreement_866.sellerSig;
    }

    function retriveStatus() public view returns (string memory) {
        return
            string(
                abi.encodePacked(
                    agreement_866.isApprovedByBuyer,
                    ";",
                    agreement_866.isApprovedBySeller,
                    ";",
                    agreement_866.isCancelledByBuyer,
                    ";",
                    agreement_866.isCancelledBySeller
                )
            );
    }

    function compareStrings(string memory a, string memory b)
        private
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }

    function approvedAgreement(string memory senderType, string memory sig)
        public
    {
        if (compareStrings(senderType, "SELLER")) {
            agreement_866.seller = msg.sender;
            agreement_866.isApprovedBySeller = "TRUE";
            agreement_866.sellerSig = sig;
        } else {
            agreement_866.buyer = msg.sender;
            agreement_866.isApprovedByBuyer = "TRUE";
            agreement_866.buyerSig = sig;
        }
    }

    function rejectAgreement(string memory senderType) public {
        if (compareStrings(senderType, "SELLER")) {
            agreement_866.seller = msg.sender;
            agreement_866.isCancelledBySeller = "TRUE";
        } else {
            agreement_866.buyer = msg.sender;
            agreement_866.isCancelledByBuyer = "TRUE";
        }
    }
}
